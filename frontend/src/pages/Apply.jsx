import { useState } from 'react';
import './Apply.css';

const Apply = () => {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    amount: '',
    purpose: '',
    language: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [successData, setSuccessData] = useState(null);

  const languages = ['Hindi', 'Tamil', 'Telugu', 'Marathi', 'English'];

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        return value.trim() === '' ? 'Name is required' : '';
      case 'mobile':
        if (value.trim() === '') return 'Mobile number is required';
        if (!/^[6-9]\d{9}$/.test(value)) return 'Mobile must be a 10-digit number starting with 6-9';
        return '';
      case 'amount':
        if (value === '') return 'Loan amount is required';
        const numAmount = Number(value);
        if (isNaN(numAmount) || numAmount < 1000) return 'Loan amount must be at least ₹1,000';
        return '';
      case 'purpose':
        return value.trim() === '' ? 'Loan purpose is required' : '';
      case 'language':
        return value === '' ? 'Please select a preferred language' : '';
      default:
        return '';
    }
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (submitError) setSubmitError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          mobile: formData.mobile,
          amount: Number(formData.amount),
          purpose: formData.purpose.trim(),
          language: formData.language
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit application');
      }

      setSuccessData(data);
      setFormData({ name: '', mobile: '', amount: '', purpose: '', language: '' });
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitAnother = () => {
    setSuccessData(null);
    setErrors({});
    setSubmitError('');
  };

  if (successData) {
    return (
      <div className="apply-container">
        <div className="success-section">
          <div className="success-icon">✓</div>
          <h2 className="success-title">Application submitted successfully!</h2>
          <p className="success-message">
            Your loan application has been received and is being processed.
          </p>
          <div className="reference-section">
            <p className="reference-label">Your reference number:</p>
            <div className="reference-number">{successData.id}</div>
          </div>
          <button className="btn btn-primary" onClick={handleSubmitAnother}>
            Submit another application
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="apply-container">
      <div className="apply-header">
        <h1>Apply for a Loan</h1>
        <p>Fill out the form below to submit your loan application</p>
      </div>

      <form onSubmit={handleSubmit} className="apply-form" noValidate>
        <div className="form-group">
          <label htmlFor="name">Applicant Name <span className="required">*</span></label>
          <input
            type="text" id="name" name="name" value={formData.name}
            onChange={handleChange} className={errors.name ? 'error' : ''}
            placeholder="Enter your full name"
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="mobile">Mobile Number <span className="required">*</span></label>
          <input
            type="tel" id="mobile" name="mobile" value={formData.mobile}
            onChange={handleChange} className={errors.mobile ? 'error' : ''}
            placeholder="10-digit number starting with 6-9" maxLength="10"
          />
          {errors.mobile && <span className="error-message">{errors.mobile}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="amount">Loan Amount (₹) <span className="required">*</span></label>
          <input
            type="number" id="amount" name="amount" value={formData.amount}
            onChange={handleChange} className={errors.amount ? 'error' : ''}
            placeholder="Minimum ₹1,000" min="1000" step="1000"
          />
          {errors.amount && <span className="error-message">{errors.amount}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="purpose">Loan Purpose <span className="required">*</span></label>
          <textarea
            id="purpose" name="purpose" value={formData.purpose}
            onChange={handleChange} className={errors.purpose ? 'error' : ''}
            placeholder="Describe the purpose of your loan" rows="4"
          />
          {errors.purpose && <span className="error-message">{errors.purpose}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="language">Preferred Language <span className="required">*</span></label>
          <select
            id="language" name="language" value={formData.language}
            onChange={handleChange} className={errors.language ? 'error' : ''}
          >
            <option value="">Select a language</option>
            {languages.map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
          {errors.language && <span className="error-message">{errors.language}</span>}
        </div>

        {submitError && <div className="submit-error">{submitError}</div>}

        <button type="submit" className="btn btn-primary btn-submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>
    </div>
  );
};

export default Apply;
