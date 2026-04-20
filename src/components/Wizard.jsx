import React from 'react';
import '../styles/components/wizard.css';
import { useSelector, useDispatch } from 'react-redux';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { nextStep, prevStep } from '../redux/configSlice';
import ContactInfo from '../pages/ContactInfo';
import VoltagePower from '../pages/VoltagePower';
import SummaryQuote from '../pages/SummaryQuote';
import StepIndicator from './StepIndicator';

const Wizard = () => {
  const step = useSelector((state) => state.config.step);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  React.useEffect(() => {
    navigate(`/step${step}`);
  }, [step, navigate]);

  return (
    <div className="wizard-container">
      <div className="d-flex justify-content-between align-items-end pb-3 mb-4" style={{ borderBottom: '1px solid var(--border-color)' }}>
        <h4 className="mb-0" style={{ color: 'var(--text-primary)', fontWeight: '600' }}>
          {step === 1 ? 'Contact Information' : step === 2 ? 'Voltage and Power' : 'Summary and Quote'}
        </h4>
        <div style={{ paddingBottom: '4px' }}>
          <StepIndicator currentStep={step} totalSteps={3} />
        </div>
      </div>
      <div className="wizard-body">
        <Routes>
          <Route path="/" element={<Navigate to="/step1" replace />} />
          <Route path="/step1" element={<ContactInfo />} />
          <Route path="/step2" element={<VoltagePower />} />
          <Route path="/step3" element={<SummaryQuote />} />
        </Routes>
      </div>
    </div>
  );
};

export default Wizard;
