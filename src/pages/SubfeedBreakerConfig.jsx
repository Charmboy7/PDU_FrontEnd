import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { nextStep, prevStep, setSectionData } from '../redux/slices/configSlice';
import FormButton from '../components/FormButton';
import SubfeedCard from '../components/SubfeedCard';

const SubfeedBreakerConfig = () => {
  const dispatch = useDispatch();
  const stepData = useSelector((state) => state.config.SubfeedBreakerConfig);
  const { options, rules } = useSelector((state) => state.metadata);

  // Initialize outlets map if it doesn't exist
  useEffect(() => {
    if (!stepData.outlets) {
      dispatch(setSectionData({
        section: 'SubfeedBreakerConfig',
        data: { outlets: {} }
      }));
    }
  }, [stepData.outlets, dispatch]);

  const outlets = stepData.outlets || {};

  // --- Derive data from metadata ---
  let outletTypes = options.outlet_type || [];
  const allFeatures = options.outlet_feature || [];

  // Find the single rule that maps outlet_type → allowed outlet_features
  const featureRule = rules.find(
    r => r.screen_name === 'subfeed_breaker_configuration' && r.field_name === 'outlet_feature'
  );

  // Find the rule that maps outlet_type → max quantity
  const quantityRule = rules.find(
    r => r.screen_name === 'subfeed_breaker_configuration' && r.field_name === 'quantity'
  );

  // Filter outletTypes to only show those that are explicitly configured for this screen
  if (featureRule || quantityRule) {
    const configuredTypes = new Set([
      ...(featureRule?.rules?.conditions?.map(c => c.if) || []),
      ...(quantityRule?.rules?.conditions?.map(c => c.if) || [])
    ]);
    outletTypes = outletTypes.filter(ot => configuredTypes.has(ot.value));
  }

  /**
   * Resolve allowed features for a given outlet type.
   * Falls back to showing all features if no rule is found.
   */
  const getAllowedFeatures = (outletTypeValue) => {
    if (!featureRule) return allFeatures;
    const condition = featureRule.rules?.conditions?.find(c => c.if === outletTypeValue);
    if (!condition) return allFeatures;
    return allFeatures.filter(f => condition.values.includes(f.value));
  };

  /**
   * Resolve max quantity for a given outlet type.
   * Falls back to 24 if no rule is found.
   */
  const getMaxQuantity = (outletTypeValue) => {
    if (!quantityRule) return 24;
    const condition = quantityRule.rules?.conditions?.find(c => c.if === outletTypeValue);
    return condition?.max ?? 24;
  };

  const handleCardChange = (updatedOutlet) => {
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

  return (
    <div className="step-container">
      <div
        className="section-label mb-2"
        style={{ color: 'var(--text-label)', fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px' }}
      >
        OUTLET TYPE &amp; FEATURES
      </div>

      <div className="subfeed-grid">
        {outletTypes.map(outletType => {
          const allowedFeatures = getAllowedFeatures(outletType.value);
          const maxQty = getMaxQuantity(outletType.value);
          const currentValue = outlets[outletType.value] || null;

          return (
            <SubfeedCard
              key={outletType.value}
              outletType={outletType}
              outletFeatures={allowedFeatures}
              maxQuantity={maxQty}
              value={currentValue}
              onChange={handleCardChange}
            />
          );
        })}
      </div>

      {/* Show a fallback if metadata isn't loaded yet */}
      {outletTypes.length === 0 && (
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '2rem' }}>
          Loading outlet options...
        </p>
      )}

      {/* NAVIGATION */}
      <div className="wizard-actions mt-5">
        <FormButton variant="secondary" onClick={() => dispatch(prevStep())}>
          Previous
        </FormButton>
        <FormButton
          variant="primary"
          onClick={() => dispatch(nextStep())}
        >
          Next
        </FormButton>
      </div>
    </div>
  );
};

export default SubfeedBreakerConfig;
