import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { nextStep, prevStep, setSectionData } from '../redux/slices/configSlice';
import FormButton from '../components/FormButton';
import FormInput from '../components/FormInput';
import api from '../services/api';

/**
 * Metadata for Accessories
 */
const ACCESSORIES_METADATA = {
  sensors: [
    {
      id: 'temp_humidity_sensor',
      label: 'Temperature + Humidity 2-in-1 Sensor + 4m cord'
    },
    {
      id: 'temp_sensor',
      label: 'Temperature sensor + 4m cord'
    }
  ],
  cable_accessories: [
    {
      id: 'sleeve_c14',
      label: 'Sleeve attached to C14 power cord inlet (pack of 10)'
    },
    {
      id: 'sleeve_c20',
      label: 'Sleeve attached to C20 power cord inlet (pack of 10)'
    }
  ]
};

const AccessoriesSelection = () => {
  const dispatch = useDispatch();
  const configState = useSelector((state) => state.config);
  const { quoteId, quoteNumber, GeneralQuoteInfo, TransformerConfig, EnclosureConfig, AccessoriesSelection: stepData } = configState;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleUpdate = (category, field, value) => {
    // Ensure value is a non-negative integer
    const numericValue = value === '' ? 0 : parseInt(value, 10);
    
    if (isNaN(numericValue) || numericValue < 0) return;

    let updatedSectionData;
    if (category === 'external_display') {
      updatedSectionData = { external_display: numericValue };
    } else {
      updatedSectionData = {
        [category]: {
          ...stepData[category],
          [field]: numericValue
        }
      };
    }

    dispatch(setSectionData({
      section: 'AccessoriesSelection',
      data: updatedSectionData
    }));
  };

  const validate = () => {
    const newErrors = {};
    // All inputs are numeric and non-negative (handled by handleUpdate and input type)
    // Here we can add extra validation if needed
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (validate()) {
      setIsSubmitting(true);
      try {
        await api.put(`/configurations/${quoteId}`, {
          step: 7,
          config_data: {
            quote_number: quoteNumber,
            GeneralQuoteInfo,
            TransformerConfig,
            "Enclosure Configuration": EnclosureConfig,
            "Accessories Configuration": stepData
          }
        });
        dispatch(nextStep());
      } catch (error) {
        console.error("Failed to save accessories configuration:", error);
        alert("Failed to save configuration. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="step-container">
      <div className="row g-4">
        {/* Sensors Section */}
        <div className="col-md-4">
          <SectionWrapper title="Sensors">
            {ACCESSORIES_METADATA.sensors.map((item, index) => (
              <QuantityItem
                key={item.id}
                label={item.label}
                value={stepData.sensors[item.id]}
                onChange={(val) => handleUpdate('sensors', item.id, val)}
                showDivider={index !== ACCESSORIES_METADATA.sensors.length - 1}
              />
            ))}
          </SectionWrapper>
        </div>

        {/* External Display Section */}
        <div className="col-md-4">
          <SectionWrapper title="External Display">
            <div className="d-flex flex-column align-items-center h-100 justify-content-center">
              <QuantityItem
                label="External Display"
                value={stepData.external_display}
                onChange={(val) => handleUpdate('external_display', null, val)}
                compact
                showDivider={false}
              />
            </div>
          </SectionWrapper>
        </div>

        {/* Cable Accessories Section */}
        <div className="col-md-4">
          <SectionWrapper title="Cable Accessories">
            {ACCESSORIES_METADATA.cable_accessories.map((item, index) => (
              <QuantityItem
                key={item.id}
                label={item.label}
                value={stepData.cable_accessories[item.id]}
                onChange={(val) => handleUpdate('cable_accessories', item.id, val)}
                showDivider={index !== ACCESSORIES_METADATA.cable_accessories.length - 1}
              />
            ))}
          </SectionWrapper>
        </div>
      </div>

      {/* NAVIGATION */}
      <div className="wizard-actions mt-5">
        <FormButton variant="secondary" onClick={() => dispatch(prevStep())}>
          Previous
        </FormButton>
        <FormButton
          variant="primary"
          onClick={handleNext}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Next'}
        </FormButton>
      </div>
    </div>
  );
};

const SectionWrapper = ({ title, children }) => (
  <div className="form-toggle-group-container h-100">
    <div className="form-toggle-group-header">{title}</div>
    <div className="form-toggle-group-body p-3">
      {children}
    </div>
  </div>
);

const QuantityItem = ({ label, value, onChange, compact = false, showDivider = true }) => (
  <div className={`${compact ? 'w-100 text-center' : 'mb-4'}`}>
    <div className="mb-2" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
      {label}
    </div>
    <div className={`d-flex align-items-center ${compact ? 'justify-content-center' : ''}`}>
      <span className="me-2" style={{ fontSize: '0.85rem', fontWeight: '500' }}>Quantity</span>
      <div style={{ width: '100px' }}>
        <FormInput
          type="number"
          value={value === 0 ? '' : value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0"
          min="0"
          onKeyDown={(e) => {
            if (['-', '+', 'e', 'E', '.'].includes(e.key)) {
              e.preventDefault();
            }
          }}
        />
      </div>
    </div>
    {showDivider && <div className="mt-4" style={{ borderBottom: '1px solid var(--border-color)', opacity: '0.5' }}></div>}
  </div>
);

export default AccessoriesSelection;
