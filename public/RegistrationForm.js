import React, { useState } from 'react';
import RegistrationModal from './RegistrationModal';
import { registrationFields } from '../Fields/FieldsConfig';
import ProfilePicture from './ProfilePic';
import defaultpic from '../defaultpic.png';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmpassword: '',
    displayname: '',
    profilepic: ''
  });
  const [errors, setErrors] = useState({});
  const [profilePicPreview, setProfilePicPreview] = useState(defaultpic);
  const [showModal, setShowModal] = useState(false);

  // Validation checks
  const validateField = (name, value) => {
    if (!value.trim()) {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} is required.`; // Capitalize field name for the message
    }
    
    switch (name) {
      case 'username':
        const users = JSON.parse(sessionStorage.getItem('users') || '[]');
        if (users.find(user => user.username === value)) {
          return 'Username is already taken.';
        }
        break;
      case 'password':
        if (value.length < 8 || !/\d/.test(value) || !/[a-zA-Z]/.test(value)) {
          return 'Password must be at least 8 characters long, include at least one letter, and one number.';
        }
        break;
      case 'confirmpassword':
        if (value !== formData.password) {
          return 'Passwords do not match.';
        }
        break;
      default:
        return '';
    }
    return '';
  };
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    let isValid = true;

    // Re-validate all fields
    const validationErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) {
        validationErrors[key] = error;
        isValid = false;
      }
    });

    if (!isValid) {
      setErrors(validationErrors);
      alert("Please correct the errors before submitting.");
      return;
    }

    try {
      // Here, we assume that your server has a route '/register' to handle user registration
      const response = await fetch('http://localhost:8080/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password, // Ensure password is encrypted/hashed before sending
          displayname: formData.displayname,
          profilepic: formData.profilepic // This will be just a reference or path to the image
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert('Registration successful!');
        setShowModal(false);
        resetForm();
      } else {
        // Handle errors from the server
        setErrors(data.errors);
      }
    } catch (error) {
      // Handle network or server error
      console.error('There was an error!', error);
    }
    
    
  };

  const resetForm = () => {
    setFormData({
      username: '',
      password: '',
      confirmpassword: '',
      displayname: '',
      profilepic: ''
    });
    setErrors({});
    setProfilePicPreview(defaultpic);
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleInputChange(e);
      const reader = new FileReader();
      reader.onloadend = () => setProfilePicPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setProfilePicPreview(defaultpic);
    }
  };

  const fields = registrationFields.map(field => ({
    ...field,
    value: formData[field.name],
    onChange: field.type === 'file' ? handleProfilePicChange : handleInputChange,
    className: errors[field.name] ? 'is-invalid' : formData[field.name] ? 'is-valid' : '',
    errorMessage: errors[field.name],
  }));

  const handleShowModal = () => setShowModal(true);

  const onHideModal = () => {
    setShowModal(false);
    resetForm();
  };

  return (
    <>
      <div className="text-center my-4">
        <button className="btn btn-success btn-lg" onClick={handleShowModal}>
          Create New Account
        </button>
      </div>
      <RegistrationModal
        show={showModal}
        onHide={onHideModal}
        fields={fields}
        handleSubmit={handleRegisterSubmit}
        submitLabel="Sign Up"
        errors={errors}
        profile={<ProfilePicture pictureUrl={profilePicPreview} />}
      />
    </>
  );
};

export default RegistrationForm;
