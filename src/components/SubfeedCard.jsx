import React from 'react';
import FormToggle from './FormToggle';
import FormDropdown from './FormDropdown';
import { subfeedImages } from '../constants/subfeedImages';
import '../styles/components/subfeed-card.css';

const SubfeedCard = ({ outletType, outletFeatures, quantityOptions, value, onChange }) => {
  // value structure: { type, quantity, features: { STANDARD: true, LOCKABLE: false, ... } }
  const qty = value?.quantity || 0;
  const selectedFeatures = value?.features || {};

  const handleQuantityChange = (e) => {
    // Selection comes from a discrete list now
    const newQty = e.target.value;
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
      features: checked ? { [featureValue]: true } : {}
    });
  };

  const image = subfeedImages[outletType.value];
  const isNema = outletType.value === 'NEMA_5_20R';

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

      {!isNema && outletFeatures.map(feature => (
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
