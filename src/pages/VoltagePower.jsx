import React from 'react';
import '../styles/components/button.css';
import { useDispatch } from 'react-redux';
import { nextStep, prevStep } from '../redux/configSlice';
import FormButton from '../components/FormButton';

const VoltagePower = () => {
  const dispatch = useDispatch();

  return (
    <div>
      <p className="text-muted mb-4">Select voltage options for your PDU.</p>

      <div className="wizard-actions">
        <FormButton variant="secondary" onClick={() => dispatch(prevStep())}>
          Previous
        </FormButton>
        <FormButton variant="primary" onClick={() => dispatch(nextStep())}>
          Next
        </FormButton>
      </div>
    </div>
  );
};

export default VoltagePower;
