import React from 'react';
import { useDispatch } from 'react-redux';
import { nextStep, prevStep } from '../redux/slices/configSlice';
import FormButton from '../components/FormButton';

const EnclosureConfig = () => {
  const dispatch = useDispatch();

  return (
    <div className="step-container">
      <p className="text-muted mb-4">Enclosure Configuration coming soon.</p>

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

export default EnclosureConfig;
