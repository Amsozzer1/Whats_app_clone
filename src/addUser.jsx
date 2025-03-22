import React, { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import './AddUserPopup.css';


const AddUserPopup = ({ isOpen, onClose, onAddUser }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate inputs
    if (!email.trim() || !name.trim()) {
      setError('Please fill in all fields');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    
    try {
      await onAddUser({ email, name });
      // Reset form
      setEmail('');
      setName('');
      onClose();
    } catch (error) {
      setError(error.message || 'Failed to add user. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        {/* Header */}
        <div className="popup-header">
          <h2 className="popup-title">
            <PersonAddIcon className="popup-icon" /> Add New Contact
          </h2>
          <button 
            onClick={onClose}
            className="close-button"
          >
            <CloseIcon />
          </button>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-fields">
            <div className="form-field">
              <label htmlFor="name" className="field-label">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter contact name"
                className="text-input"
              />
            </div>
            
            <div className="form-field">
              <label htmlFor="email" className="field-label">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                className="text-input"
              />
            </div>
            
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
          </div>
          
          <div className="form-buttons">
            <button
              type="button"
              onClick={onClose}
              className="cancel-button"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`submit-button ${isLoading ? 'button-loading' : ''}`}
            >
              {isLoading ? (
                <>
                  <svg className="loading-spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="spinner-track" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="spinner-path" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding...
                </>
              ) : (
                'Add Contact'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserPopup;