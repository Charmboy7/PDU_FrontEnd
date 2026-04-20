import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { nextStep, prevStep, setSectionData } from '../redux/slices/configSlice';
import FormButton from '../components/FormButton';
import FormToggleGroup from '../components/FormToggleGroup';

const TransformerConfig = () => {
  const dispatch = useDispatch();
  const stepData = useSelector((state) => state.config.TransformerConfig);

  // Initialize data if not present
  useEffect(() => {
    if (!stepData.phase) {
      dispatch(setSectionData({
        section: 'TransformerConfig',
        data: {
          phase: '1PH',
          voltage: '230V',
          current: '',
          inputPlug: ''
        }
      }));
    }
  }, [stepData.phase, dispatch]);

  const { phase = '1PH', voltage = '', current = '', inputPlug = '' } = stepData;

  const handleSelection = (name, value) => {
    const updates = { [name]: value };

    // Conditional Logic for Voltage
    if (name === 'phase') {
      if (value === '1PH') updates.voltage = '230V';
      if (value === '3PH') updates.voltage = '400V';
    }

    // Input Plug single selection logic across groups
    if (name === 'iecPlug' || name === 'unterminatedPlug') {
      updates.inputPlug = value;
    }

    dispatch(setSectionData({ section: 'TransformerConfig', data: updates }));
  };

  const isStepValid = phase && voltage && current; // and inputPlug if we had plugs enabled

  // Options (could be moved to a constants file or fetched from API)
  const phaseOptions = [
    { label: '1PH', value: '1PH' },
    { label: '3PH', value: '3PH' }
  ];

  const voltageOptions = phase === '1PH'
    ? [{ label: '230V', value: '230V' }]
    : [{ label: '400V', value: '400V' }];

  const currentOptions = [
    { label: '16A', value: '16A' },
    { label: '32A', value: '32A' }
  ];

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
            value={voltage}
            onChange={(e) => handleSelection('voltage', e.target.value)}
            required
          />
        </div>
        <div className="col-md-4">
          <FormToggleGroup
            label="Input Current"
            options={currentOptions}
            value={current}
            onChange={(e) => handleSelection('current', e.target.value)}
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
