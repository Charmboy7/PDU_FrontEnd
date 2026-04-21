import React from 'react';
import FormToggle from './FormToggle';
import FormDropdown from './FormDropdown';
import { subfeedImages } from '../constants/subfeedImages';
import '../styles/components/subfeed-card.css';

const SubfeedCard = ({ outletType, outletFeatures, maxQuantity, value, onChange }) => {
  // value structure: { type, quantity, features: { STANDARD: true, LOCKABLE: false, ... } }
  const qty = value?.quantity || 0;
  const selectedFeatures = value?.features || {};

  const handleQuantityChange = (e) => {
    const newQty = Math.min(parseInt(e.target.value, 10) || 0, maxQuantity);
    onChange({
      type: outletType.value,
      quantity: newQty,
      features: selectedFeatures
    });
  };

  const handleToggle = (featureValue, checked) => {
    onChange({
      type: outletType.value,
      quantity: qty,
      features: {
        ...selectedFeatures,
        [featureValue]: checked
      }
    });
  };

  // Generate quantity options from 0..maxQuantity
  const quantityOptions = Array.from({ length: maxQuantity + 1 }, (_, i) => i);

  const image = subfeedImages[outletType.value];

  return (
    <div className="subfeed-card">
      <div className="subfeed-card-header">
        {outletType.label}
      </div>

      <div className="subfeed-quantity-row">
        <span>Quantity</span>
        <FormDropdown
          options={quantityOptions}
          value={qty}
          onChange={handleQuantityChange}
        />
      </div>

      <div className="subfeed-image-container">
        {image
          ? <img src={image} alt={outletType.label} />
          : <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>No image</span>
        }
      </div>

      {outletFeatures.map(feature => (
        <div className="subfeed-feature-row" key={feature.value}>
          <span>{feature.label}</span>
          <FormToggle
            value={selectedFeatures[feature.value] || false}
            onChange={(val) => handleToggle(feature.value, val)}
          />
        </div>
      ))}
    </div>
  );
};

export default SubfeedCard;
