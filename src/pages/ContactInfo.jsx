import React, { useState, useEffect } from 'react';
import '../styles/components/button.css';
import { useDispatch, useSelector } from 'react-redux';
import { nextStep, updateData } from '../redux/configSlice';
import FormInput from '../components/FormInput';
import FormSelect from '../components/FormSelect';
import FormRadioGroup from '../components/FormRadioGroup';
import FormButton from '../components/FormButton';

const ContactInfo = () => {
  const dispatch = useDispatch();
  const configData = useSelector((state) => state.config.data);

  const [formData, setFormData] = useState({
    name: configData.name || '',
    email: configData.email || '',
    country: configData.country || '',
    postalCode: configData.postalCode || '',
    productRegion: configData.productRegion || '',
    quantity: configData.quantity || ''
  });

  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);

  const regionOptions = [
    { label: 'North America', value: 'NA' },
    { label: 'Europe', value: 'EU' },
    { label: 'Asia', value: 'AS' }
  ];

  const countryOptions = [
    { label: 'United States', value: 'US' },
    { label: 'Canada', value: 'CA' },
    { label: 'United Kingdom', value: 'UK' },
    { label: 'Germany', value: 'DE' },
    { label: 'France', value: 'FR' },
    { label: 'Japan', value: 'JP' },
    { label: 'Other', value: 'OTHER' }
  ];

  const validate = (data) => {
    let newErrors = {};
    if (!data.name.trim()) newErrors.name = 'Name is required';
    if (!data.email.trim()) {
      newErrors.email = 'E-Mail is required';
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      newErrors.email = 'E-Mail is invalid';
    }
    if (!data.country) newErrors.country = 'Country is required';
    if (!data.postalCode.trim()) newErrors.postalCode = 'Postal Code is required';
    if (!data.productRegion) newErrors.productRegion = 'Product Region is required';
    if (!data.quantity || Number(data.quantity) <= 0) newErrors.quantity = 'Valid quantity is required';

    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0);
  };

  useEffect(() => {
    validate(formData);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (isValid) {
      dispatch(updateData(formData));
      dispatch(nextStep());
    }
  };

  return (
    <div>
      <div className="row">
        <div className="col-md-6">
          <FormInput
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            error={errors.name}
            required
          />
        </div>
        <div className="col-md-6">
          <FormInput
            label="E-Mail"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
            error={errors.email}
            required
          />
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <FormSelect
            label="Country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            options={countryOptions}
            error={errors.country}
            required
          />
        </div>
        <div className="col-md-6">
          <FormInput
            label="Postal Code"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            placeholder="12345"
            error={errors.postalCode}
            required
          />
        </div>
      </div>

      <div className="row mt-2">
        <div className="col-md-8">
          <FormRadioGroup
            label="Product Region"
            name="productRegion"
            value={formData.productRegion}
            onChange={handleChange}
            options={regionOptions}
            error={errors.productRegion}
            required
          />
        </div>
        <div className="col-md-4">
          <FormInput
            label="Quantity"
            name="quantity"
            type="number"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="1"
            error={errors.quantity}
            required
          />
        </div>
      </div>

      <div className="wizard-actions">
        <FormButton variant="secondary" disabled={true}>
          Previous
        </FormButton>
        <FormButton variant="primary" onClick={handleNext} disabled={!isValid}>
          Next
        </FormButton>
      </div>
    </div>
  );
};

export default ContactInfo;
