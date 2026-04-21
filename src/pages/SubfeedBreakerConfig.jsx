import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { nextStep, prevStep, setSectionData } from '../redux/slices/configSlice';
import FormButton from '../components/FormButton';
import SubfeedCard from '../components/SubfeedCard';
import { subfeedOptions } from '../constants/subfeedOptions';

const SubfeedBreakerConfig = () => {
  const dispatch = useDispatch();
  const stepData = useSelector((state) => state.config.SubfeedBreakerConfig);

  // Initialize outlets array if it doesn't exist
  useEffect(() => {
    if (!stepData.outlets) {
      dispatch(setSectionData({
        section: 'SubfeedBreakerConfig',
        data: { outlets: [] }
      }));
    }
  }, [stepData.outlets, dispatch]);

  const outlets = stepData.outlets || [];

  const handleCardChange = (updatedOutlet) => {
    // If quantity is 0 and all features are false, we could technically drop it from array, 
    // but updating it is fine.
    let newOutlets = [...outlets];
    const existingIndex = newOutlets.findIndex(o => o.type === updatedOutlet.type);

    if (existingIndex > -1) {
      newOutlets[existingIndex] = updatedOutlet;
    } else {
      newOutlets.push(updatedOutlet);
    }

    dispatch(setSectionData({
      section: 'SubfeedBreakerConfig',
      data: { outlets: newOutlets }
    }));
  };

  return (
    <div className="step-container">
      <div className="section-label mb-2" style={{ color: 'var(--text-label)', fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px' }}>
        OUTLET TYPE & FEATURES
      </div>
      
      <div className="subfeed-grid">
        {subfeedOptions.map(option => {
          // Find the value payload for this specific card
          const val = outlets.find(o => o.type === option.type) || null;

          return (
            <SubfeedCard 
              key={option.type}
              option={option}
              value={val}
              onChange={handleCardChange}
            />
          )
        })}
      </div>

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
