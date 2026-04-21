import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { nextStep, prevStep, setSectionData } from '../redux/slices/configSlice';
import FormButton from '../components/FormButton';
import FormToggleGroup from '../components/FormToggleGroup';

const TransformerConfig = () => {
  const dispatch = useDispatch();
  const stepData = useSelector((state) => state.config.TransformerConfig);
  const { options, rules } = useSelector((state) => state.metadata);

  const { phase = '', input_voltage = '', input_current = '', inputPlug = '' } = stepData;

  // Filter options based on rules
  const getFilteredOptions = (fieldName, dependentValue) => {
    const fieldOptions = options[fieldName] || [];
    const rule = rules.find(r => r.field_name === fieldName && r.screen_name === 'transformer_configuration');
    
    if (!rule || !dependentValue) return fieldOptions;

    const condition = rule.rules.conditions.find(c => c.if === dependentValue);
    if (!condition) return [];

    return fieldOptions.filter(opt => condition.values.includes(opt.value));
  };

  const phaseOptions = options['phase'] || [];
  const voltageOptions = getFilteredOptions('input_voltage', phase);
  const currentOptions = getFilteredOptions('input_current', phase);

  // Initialize data if not present
  useEffect(() => {
    if (!phase && phaseOptions.length > 0) {
      const defaultPhase = phaseOptions[0].value;
      const initialVoltage = getFilteredOptions('input_voltage', defaultPhase)[0]?.value || '';
      const initialCurrent = getFilteredOptions('input_current', defaultPhase)[0]?.value || '';
      
      dispatch(setSectionData({
        section: 'TransformerConfig',
        data: {
          phase: defaultPhase,
          input_voltage: initialVoltage,
          input_current: initialCurrent,
          inputPlug: ''
        }
      }));
    }
  }, [phase, phaseOptions, dispatch]);

  const handleSelection = (name, value) => {
    const updates = { [name]: value };

    // When phase changes, reset dependent fields to their first valid option
    if (name === 'phase') {
      const validVoltages = getFilteredOptions('input_voltage', value);
      const validCurrents = getFilteredOptions('input_current', value);
      
      updates.input_voltage = validVoltages[0]?.value || '';
      updates.input_current = validCurrents[0]?.value || '';
    }

    if (name === 'iecPlug' || name === 'unterminatedPlug') {
      updates.inputPlug = value;
    }

    dispatch(setSectionData({ section: 'TransformerConfig', data: updates }));
  };

  const isStepValid = phase && input_voltage && input_current;

  return (
    <div className="step-container">
      <div className="section-label mb-2" style={{ color: 'var(--text-label)', fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px' }}>PDU-INPUT</div>
      <div className="row">
        <div className="col-md-4">
          <FormToggleGroup
            label="Phase"
            options={phaseOptions}
            value={phase}
            onChange={(e) => handleSelection('phase', e.target.value)}
            required
          />
        </div>
        <div className="col-md-4">
          <FormToggleGroup
            label="Input Voltage"
            options={voltageOptions}
            value={input_voltage}
            onChange={(e) => handleSelection('input_voltage', e.target.value)}
            required
          />
        </div>
        <div className="col-md-4">
          <FormToggleGroup
            label="Input Current"
            options={currentOptions}
            value={input_current}
            onChange={(e) => handleSelection('input_current', e.target.value)}
            required
          />
        </div>
      </div>

      <div className="wizard-actions mt-5">
        <FormButton variant="secondary" onClick={() => dispatch(prevStep())}>
          Previous
        </FormButton>
        <FormButton
          variant="primary"
          onClick={() => dispatch(nextStep())}
          disabled={!isStepValid}
        >
          Next
        </FormButton>
      </div>
    </div>
  );
};

export default TransformerConfig;
