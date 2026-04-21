import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { nextStep, prevStep, setSectionData, initializeSubfeed } from '../redux/slices/configSlice';
import FormButton from '../components/FormButton';
import SubfeedCard from '../components/SubfeedCard';
import { isEqual } from 'lodash';
import api from '../services/api';
import { buildCumulativePayload } from '../utils/configHelpers';

const SubfeedBreakerConfig = () => {
  const dispatch = useDispatch();
  const configState = useSelector((state) => state.config);
  const { quoteId, SubfeedBreakerConfig: stepData } = configState;
  const { options, rules } = useSelector((state) => state.metadata);
  
  const [validationError, setValidationError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const initialStepData = useRef(null);

  // Derive data from metadata
  const rawOutletTypes = options.outlet_type || [];
  const allFeatures = options.outlet_feature || [];
  const allQuantities = options.outlet_quantity || [];

  // Filter outletTypes to only show those that are explicitly configured for this screen
  const featureRule = rules.find(
    r => r.screen_name === 'subfeed_breaker_configuration' && r.field_name === 'outlet_feature'
  );
  const quantityRule = rules.find(
    r => r.screen_name === 'subfeed_breaker_configuration' && r.field_name === 'quantity'
  );

  let outletTypes = rawOutletTypes;
  if (featureRule || quantityRule) {
    const configuredTypes = new Set([
      ...(featureRule?.rules?.conditions?.map(c => c.if) || []),
      ...(quantityRule?.rules?.conditions?.map(c => c.if) || [])
    ]);
    outletTypes = rawOutletTypes.filter(ot => configuredTypes.has(ot.value));
  }

  // Initialize outlets map if it doesn't exist
  useEffect(() => {
    if (outletTypes.length > 0 && (!stepData.outlets || Object.keys(stepData.outlets).length === 0)) {
      dispatch(initializeSubfeed(outletTypes));
    }
  }, [outletTypes, stepData.outlets, dispatch]);

  // Sync initialStepData once data is ready
  useEffect(() => {
    if (stepData.outlets && Object.keys(stepData.outlets).length > 0 && initialStepData.current === null) {
      initialStepData.current = stepData;
    }
  }, [stepData]);

  const outlets = stepData.outlets || {};
  const isValid = Object.values(outlets).some(o => parseInt(o.quantity, 10) > 0);

  /**
   * Resolve allowed features for a given outlet type.
   */
  const getAllowedFeatures = (outletTypeValue) => {
    if (!featureRule) return allFeatures;
    const condition = featureRule.rules?.conditions?.find(c => c.if === outletTypeValue);
    if (!condition) return allFeatures;
    return allFeatures.filter(f => condition.values.includes(f.value));
  };

  /**
   * Resolve quantity options for a given outlet type from the metadata options table.
   */
  const getQuantityOptions = (outletTypeValue) => {
    return allQuantities
      .filter(q => q.metadata?.outlet_type === outletTypeValue)
      .map(q => ({ label: q.label, value: q.value }));
  };

  const handleCardChange = (updatedOutlet) => {
    if (parseInt(updatedOutlet.quantity, 10) > 0) {
      setValidationError(null);
    }

    dispatch(setSectionData({
      section: 'SubfeedBreakerConfig',
      data: {
        outlets: {
          ...outlets,
          [updatedOutlet.type]: updatedOutlet
        }
      }
    }));
  };

  const handleNext = async () => {
    if (!isValid) {
      setValidationError("Please select at least one outlet type.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Only call API if data has changed (limit check to current step as requested)
    const hasChanges = initialStepData.current && !isEqual(stepData, initialStepData.current);
    
    if (!hasChanges) {
      dispatch(nextStep());
      return;
    }

    setIsSubmitting(true);
    try {
      await api.put(`/configurations/${quoteId}`, {
        step: 5,
        config_data: buildCumulativePayload(configState)
      });
      initialStepData.current = stepData;
      dispatch(nextStep());
    } catch (error) {
      console.error("Failed to save subfeed configuration:", error);
      setValidationError(error.response?.data?.message || "Failed to save configuration. Please try again.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="step-container">
      {validationError && (
        <div className="subfeed-error-alert">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 6V10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 14H10.01" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {validationError}
        </div>
      )}

      <div
        className="section-label mb-2"
        style={{ color: 'var(--text-label)', fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px' }}
      >
        OUTLET TYPE &amp; FEATURES
      </div>

      <div className="subfeed-grid">
        {outletTypes.map(outletType => {
          const allowedFeatures = getAllowedFeatures(outletType.value);
          const quantityOptions = getQuantityOptions(outletType.value);
          const currentValue = outlets[outletType.value] || null;

          return (
            <SubfeedCard
              key={outletType.value}
              outletType={outletType}
              outletFeatures={allowedFeatures}
              quantityOptions={quantityOptions}
              value={currentValue}
              onChange={handleCardChange}
            />
          );
        })}
      </div>

      {outletTypes.length === 0 && (
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '2rem' }}>
          Loading outlet options...
        </p>
      )}

      {/* NAVIGATION */}
      <div className="wizard-actions mt-5">
        <FormButton variant="secondary" onClick={() => dispatch(prevStep())} disabled={isSubmitting}>
          Previous
        </FormButton>
        <FormButton
          variant="primary"
          onClick={handleNext}
          disabled={isSubmitting || !isValid}
        >
          {isSubmitting ? 'Saving...' : 'Next'}
        </FormButton>
      </div>
    </div>
  );
};

export default SubfeedBreakerConfig;
