import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { nextStep, prevStep, setSectionData } from '../redux/slices/configSlice';
import FormButton from '../components/FormButton';
import FormToggle from '../components/FormToggle';
import FormInput from '../components/FormInput';
import FormSelect from '../components/FormSelect';
import api from '../services/api';
import '../styles/components/toggle-group.css';

/**
 * Enclosure Configuration Page
 * Implement three sections: Form Factor, Colored Casing, and Physical Layout.
 * Using existing Redux key: EnclosureConfig
 */
const EnclosureConfig = () => {
  const dispatch = useDispatch();
  const configState = useSelector((state) => state.config);
  const { quoteId, quoteNumber, GeneralQuoteInfo, TransformerConfig, EnclosureConfig: stepData } = configState;
  const { options, loading } = useSelector((state) => state.metadata);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const initialStepData = useRef(stepData);

  // Local state for form data, initialized from Redux
  const [formData, setFormData] = useState({
    formFactor: stepData?.formFactor || 'Vertical',
    color: stepData?.color || 'Black',
    customColor: stepData?.customColor || '',
    outletType: stepData?.outletType || '',
    numberOfOutlets: stepData?.numberOfOutlets || '',
    outletArrangement: stepData?.outletArrangement || '',
    inputPosition: stepData?.inputPosition || '',
    mountingType: stepData?.mountingType || '',
    outletSpacing: stepData?.outletSpacing || ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (name, value) => {
    const updatedData = { ...formData, [name]: value };
    setFormData(updatedData);
    
    // Step 5.4: Ensure state updates on every user interaction
    dispatch(setSectionData({ section: 'EnclosureConfig', data: { [name]: value } }));
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.formFactor) newErrors.formFactor = 'Form Factor is required';
    if (!formData.color) newErrors.color = 'Color is required';
    if (formData.color === 'Custom' && !formData.customColor) {
      newErrors.customColor = 'Custom color is required';
    }
    if (!formData.outletType) newErrors.outletType = 'Outlet Type is required';
    if (!formData.numberOfOutlets) newErrors.numberOfOutlets = 'Number of Outlets is required';
    if (!formData.outletArrangement) newErrors.outletArrangement = 'Outlet Arrangement is required';
    if (!formData.inputPosition) newErrors.inputPosition = 'Input Position is required';
    if (!formData.mountingType) newErrors.mountingType = 'Mounting Type is required';
    if (!formData.outletSpacing) newErrors.outletSpacing = 'Outlet Spacing is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (validate()) {
      // Only call API if data has changed
      const hasChanges = JSON.stringify(stepData) !== JSON.stringify(initialStepData.current);
      
      if (!hasChanges) {
        dispatch(nextStep());
        return;
      }

      setIsSubmitting(true);
      try {
        await api.put(`/configurations/${quoteId}`, {
          step: 3,
          config_data: {
            quote_number: quoteNumber,
            GeneralQuoteInfo: GeneralQuoteInfo,
            TransformerConfig: TransformerConfig,
            "Enclosure Configuration": stepData
          }
        });
        
        initialStepData.current = stepData;
        dispatch(nextStep());
      } catch (error) {
        console.error("Failed to save enclosure configuration:", error);
        alert("Failed to save configuration. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (loading || !options) return <div className="p-4 text-center">Loading configuration...</div>;

  return (
    <div className="step-container">
      <div className="row g-4">
        {/* Form Factor Section */}
        <div className="col-md-4">
          <FormFactorSection 
            value={formData.formFactor} 
            onChange={(val) => handleChange('formFactor', val)} 
          />
        </div>

        {/* Colored Casing Section */}
        <div className="col-md-4">
          <ColoredCasingSection 
            value={formData.color} 
            customValue={formData.customColor}
            onChange={(val) => handleChange('color', val)}
            onCustomChange={(val) => handleChange('customColor', val)}
            customError={errors.customColor}
          />
        </div>

        {/* Physical Layout Section */}
        <div className="col-md-4">
          <PhysicalLayoutSection 
            formData={formData}
            onChange={handleChange}
            options={options}
            errors={errors}
          />
        </div>
      </div>

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

// Reusable Toggle Row for consistency
const ToggleRow = ({ label, value, onClick, isSelected }) => (
  <div 
    className={`form-toggle-group-row ${isSelected ? 'selected' : ''}`}
    onClick={onClick}
  >
    <span className="form-toggle-group-label">{label}</span>
    <FormToggle value={isSelected} onChange={() => {}} />
  </div>
);

const FormFactorSection = ({ value, onChange }) => (
  <div className="form-toggle-group-container">
    <div className="form-toggle-group-header">Form Factor</div>
    <div className="form-toggle-group-body">
      <ToggleRow 
        label="Vertical" 
        value="Vertical" 
        isSelected={value === 'Vertical'} 
        onClick={() => onChange('Vertical')} 
      />
      <ToggleRow 
        label="Horizontal" 
        value="Horizontal" 
        isSelected={value === 'Horizontal'} 
        onClick={() => onChange('Horizontal')} 
      />
    </div>
  </div>
);

const ColoredCasingSection = ({ value, customValue, onChange, onCustomChange, customError }) => (
  <div className="form-toggle-group-container">
    <div className="form-toggle-group-header">Colored Casing</div>
    <div className="form-toggle-group-body">
      {['Black', 'Red', 'Blue', 'Custom'].map(color => (
        <ToggleRow 
          key={color}
          label={color}
          value={color}
          isSelected={value === color}
          onClick={() => onChange(color)}
        />
      ))}
      <div className="mt-3 px-3 pb-3">
        <FormInput
          label="Custom Color"
          placeholder="233333 or RAL code"
          value={customValue}
          onChange={(e) => onCustomChange(e.target.value)}
          disabled={value !== 'Custom'}
          error={customError}
        />
      </div>
    </div>
  </div>
);

const PhysicalLayoutSection = ({ formData, onChange, options, errors }) => (
  <div className="form-toggle-group-container">
    <div className="form-toggle-group-header">Physical Layout</div>
    <div className="form-toggle-group-body p-3">
      <FormSelect
        label="Outlet Type"
        name="outletType"
        value={formData.outletType}
        onChange={(e) => onChange('outletType', e.target.value)}
        options={options.outlet_type || []}
        error={errors.outletType}
        required
      />

      <FormInput
        label="Number of Outlets"
        name="numberOfOutlets"
        type="number"
        placeholder="e.g., 24"
        value={formData.numberOfOutlets}
        onChange={(e) => onChange('numberOfOutlets', e.target.value)}
        onKeyDown={(e) => {
          if (['-', '+', 'e', 'E', '.'].includes(e.key)) {
            e.preventDefault();
          }
        }}
        error={errors.numberOfOutlets}
        required
      />

      <FormSelect
        label="Outlet Arrangement"
        name="outletArrangement"
        value={formData.outletArrangement}
        onChange={(e) => onChange('outletArrangement', e.target.value)}
        options={options.outlet_arrangement || []}
        error={errors.outletArrangement}
        required
      />

      <FormSelect
        label="Input Position"
        name="inputPosition"
        value={formData.inputPosition}
        onChange={(e) => onChange('inputPosition', e.target.value)}
        options={options.input_position || []}
        error={errors.inputPosition}
        required
      />

      <FormSelect
        label="Mounting Type"
        name="mountingType"
        value={formData.mountingType}
        onChange={(e) => onChange('mountingType', e.target.value)}
        options={options.mounting_type || []}
        error={errors.mountingType}
        required
      />

      <FormSelect
        label="Outlet Spacing"
        name="outletSpacing"
        value={formData.outletSpacing}
        onChange={(e) => onChange('outletSpacing', e.target.value)}
        options={options.outlet_spacing || []}
        error={errors.outletSpacing}
        required
      />
    </div>
  </div>
);

export default EnclosureConfig;
