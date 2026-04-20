import React from 'react';
import '../styles/components/button.css';
import { useDispatch } from 'react-redux';
import { prevStep } from '../redux/configSlice';
import FormButton from '../components/FormButton';

const SummaryQuote = () => {
  const dispatch = useDispatch();

  return (
    <div>
      <p className="text-muted mb-4">Review your configuration.</p>

      <div className="wizard-actions">
        <FormButton variant="secondary" onClick={() => dispatch(prevStep())}>
          Previous
        </FormButton>
        <FormButton variant="primary" onClick={() => alert('Configuration Submitted!')}>
          Submit
        </FormButton>
      </div>
    </div>
  );
};

export default SummaryQuote;
