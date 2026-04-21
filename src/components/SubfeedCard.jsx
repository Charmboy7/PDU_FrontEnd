import React from 'react';
import FormToggle from './FormToggle';
import '../styles/components/subfeed-card.css';

const SubfeedCard = ({ option, value, onChange }) => {
  // Option structure: { type, label, maxQuantity, image, features: ['standard', 'lockable', 'fused'] }
  // Value structure (could be null initially): { type, quantity, standard, lockable, fused }

  // Fallback defaults if no value present for this specific breaker type yet
  const qty = value?.quantity || 0;
  
  const handleQuantityChange = (e) => {
    const newQty = parseInt(e.target.value, 10);
    onChange({
      ...value,
      type: option.type,
      quantity: newQty,
      // Default to false for toggles if they weren't set yet
      standard: value?.standard || false,
      lockable: value?.lockable || false,
      fused: value?.fused || false
    });
  };

  const handleToggle = (featureId, checked) => {
    onChange({
      ...value,
      type: option.type,
      quantity: qty,
      [featureId]: checked
    });
  };

  // Generate an array from 0 to maxQuantity for the dropdown options
  const quantityOptions = Array.from({ length: option.maxQuantity + 1 }, (_, i) => i);

  // Helper dictionary to map feature IDs to UI Labels
  const featureLabels = {
    standard: "Standard",
    lockable: "Lockable",
    fused: "Individual Fused"
  };

  return (
    <div className="subfeed-card">
      <div className="subfeed-card-header">
        {option.label}
      </div>

      <div className="subfeed-quantity-row">
        <span>Quantity</span>
        <select 
          className="subfeed-quantity-select"
          value={qty}
          onChange={handleQuantityChange}
        >
          {quantityOptions.map(num => (
            <option key={num} value={num}>{num}</option>
          ))}
        </select>
      </div>

      <div className="subfeed-image-container">
        {option.image ? (
          <img src={option.image} alt={option.label} />
        ) : (
          <span>Image Not Found</span>
        )}
      </div>

      {option.features.map(feature => (
        <div className="subfeed-feature-row" key={feature}>
          <span>{featureLabels[feature] || feature}</span>
          <FormToggle 
            value={value?.[feature] || false}
            onChange={(e) => handleToggle(feature, e.target.checked)}
          />
        </div>
      ))}

      {/* If this card has fewer features, add a gray spacer block at the bottom to match design */}
      {option.features.length < 3 && (
        <div className="subfeed-spacer"></div>
      )}
    </div>
  );
};

export default SubfeedCard;
