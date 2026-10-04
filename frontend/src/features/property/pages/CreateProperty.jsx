import React, { useState, useRef } from 'react';
import './CreateProperty.css';
import useProperty from "../hook/useProperty"
import { Navigate, useNavigate } from 'react-router-dom';

const AMENITIES_LIST = [
  'Parking',
  'Lift',
  'Garden',
  'Gym',
  'Swimming Pool',
  'Security',
  'Power Backup',
  'WiFi',
  'Balcony',
  "Children's Play Area"
];
const CreateProperty = () => {
  const navigate = useNavigate()
  const { handleCreateProperty } = useProperty();
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    address: '',
    city: '',
    state: '',
    price: '',
    area: '',
    areaUnit: 'sqft',
    bedrooms: '',
    bathrooms: '',
    amenities: [],
    images: []
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const fileInputRef = useRef(null);
  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = 'Title is required';
    if (!form.description.trim()) newErrors.description = 'Description is required';
    if (!form.category) newErrors.category = 'Category is required';
    if (!form.address.trim()) newErrors.address = 'Address is required';
    if (!form.city.trim()) newErrors.city = 'City is required';
    if (!form.state.trim()) newErrors.state = 'State is required';
    if (!form.price) newErrors.price = 'Price is required';
    else if (Number(form.price) <= 0) newErrors.price = 'Price must be greater than 0';
    
    if (!form.area) newErrors.area = 'Area is required';
    else if (Number(form.area) <= 0) newErrors.area = 'Area must be greater than 0';

    if (!form.areaUnit) newErrors.areaUnit = 'AreaUnit is required';
    
    if (!form.bedrooms) newErrors.bedrooms = 'Bedrooms are required';
    if (!form.bathrooms) newErrors.bathrooms = 'Bathrooms are required';
    
    if (form.images.length === 0) newErrors.images = 'At least 1 image is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };
  const handleAmenityToggle = (amenity) => {
    setForm((prev) => {
      const isSelected = prev.amenities.includes(amenity);
      const newAmenities = isSelected
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity];
      return { ...prev, amenities: newAmenities };
    });
  };
  // Image Upload Handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  const handleDragLeave = () => {
    setIsDragOver(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };
  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };
  const processFiles = (files) => {
    const newImages = Array.from(files).filter(file => file.type.startsWith('image/'));
    setForm(prev => {
      const totalImages = [...prev.images, ...newImages];
      // Limit to 6 images max
      if (totalImages.length > 6) {
        return { ...prev, images: totalImages.slice(0, 6) };
      }
      return { ...prev, images: totalImages };
    });
    if (errors.images) setErrors(prev => ({ ...prev, images: undefined }));
  };
  const removeImage = (indexToRemove) => {
    setForm(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove)
    }));
  };
  const handleSubmit = async (e) => {
      e.preventDefault();

      if (!validate()) return;

      setIsSubmitting(true);

      try {

          const formData = new FormData();

          formData.append("title", form.title);
          formData.append("description", form.description);
          formData.append("category", form.category);
          formData.append("address", form.address);
          formData.append("city", form.city);
          formData.append("state", form.state);
          formData.append("price", form.price);
          formData.append("area", form.area);
          formData.append("areaUnit", form.areaUnit);
          formData.append("bedrooms", form.bedrooms);
          formData.append("bathrooms", form.bathrooms);

          // amenities
          formData.append("amenities", form.amenities.join(","));

          // images
          form.images.forEach((image) => {
              formData.append("propertyImages", image);
          });

          const res = await handleCreateProperty(formData);

if (res?.success) {
  setShowSuccessModal(true);

  // Optional: Clear the form
  setForm({
    title: "",
    description: "",
    category: "",
    address: "",
    city: "",
    state: "",
    price: "",
    area: "",
    areaUnit: "sqft",
    bedrooms: "",
    bathrooms: "",
    amenities: [],
    images: [],
  });
}

      } catch (err) {
          console.log(err);
      } finally {
          setIsSubmitting(false);
      }
  };
  const getInputClass = (fieldName) => {
    if (errors[fieldName]) return 'cp-input error';
    if (form[fieldName] && !errors[fieldName]) return 'cp-input success'; // Optional success state
    return 'cp-input';
  };
  
  const getSelectClass = (fieldName) => {
    if (errors[fieldName]) return 'cp-select error';
    if (form[fieldName] && !errors[fieldName]) return 'cp-select success';
    return 'cp-select';
  };
  
  const getTextareaClass = (fieldName) => {
    if (errors[fieldName]) return 'cp-textarea error';
    if (form[fieldName] && !errors[fieldName]) return 'cp-textarea success';
    return 'cp-textarea';
  };
  return (
    <div className="cp-container">
      <div className="cp-header">
  <button
    type="button"
    className="cp-back-btn"
    onClick={() => navigate(-1)}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="19" y1="12" x2="5" y2="12"></line>
      <polyline points="12 19 5 12 12 5"></polyline>
    </svg>
    Back
  </button>

  <h1 className="cp-title">List Your Property</h1>
  <p className="cp-subtitle">
    Fill in the property details below. After submission, your listing will be reviewed by our admin before becoming publicly visible.
  </p>
</div>
      <div className="cp-card">
        <form className="cp-form" onSubmit={handleSubmit} noValidate>
          
          {/* Section 1: Basic Information */}
          <div className="cp-section">
            <h2 className="cp-section-title">Basic Information</h2>
            
            <div className="cp-group">
              <label className="cp-label">Property Title</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Modern Luxury Villa in Beverly Hills"
                className={getInputClass('title')}
                disabled={isSubmitting}
              />
              {errors.title && <span className="cp-error-text">{errors.title}</span>}
            </div>
            <div className="cp-group">
              <label className="cp-label">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe your property in detail..."
                className={getTextareaClass('description')}
                disabled={isSubmitting}
              />
              {errors.description && <span className="cp-error-text">{errors.description}</span>}
            </div>
            <div className="cp-group">
              <label className="cp-label">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className={getSelectClass('category')}
                disabled={isSubmitting}
              >
                <option value="" disabled>Select a category</option>
                <option value="Apartment">Apartment</option>
                <option value="Villa">Villa</option>
                <option value="Flat">Flat</option>
                <option value="Independent House">Independent House</option>
                <option value="Residential Plot">Residential Plot</option>
                <option value="Commercial Plot">Commercial Plot</option>
                <option value="Agricultural Land">Agricultural Land</option>
                <option value="Warehouse">Warehouse</option>
                <option value="Farmhouse">Farmhouse</option>
                <option value="Office">Office</option>
                <option value="Shop">Shop</option>
                <option value="Commercial Building">Commercial Building</option>
              </select>
              {errors.category && <span className="cp-error-text">{errors.category}</span>}
            </div>
          </div>
          {/* Section 2: Location */}
          <div className="cp-section">
            <h2 className="cp-section-title">Location</h2>
            
            <div className="cp-group">
              <label className="cp-label">Address</label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Full street address"
                className={getInputClass('address')}
                disabled={isSubmitting}
              />
              {errors.address && <span className="cp-error-text">{errors.address}</span>}
            </div>
            <div className="cp-row">
              <div className="cp-group">
                <label className="cp-label">City</label>
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="City"
                  className={getInputClass('city')}
                  disabled={isSubmitting}
                />
                {errors.city && <span className="cp-error-text">{errors.city}</span>}
              </div>
              <div className="cp-group">
                <label className="cp-label">State</label>
                <input
                  type="text"
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  placeholder="State/Province"
                  className={getInputClass('state')}
                  disabled={isSubmitting}
                />
                {errors.state && <span className="cp-error-text">{errors.state}</span>}
              </div>
            </div>
          </div>
          {/* Section 3: Property Details */}
          <div className="cp-section">
  <h2 className="cp-section-title">Property Details</h2>

  <div className="cp-row">
    <div className="cp-group">
      <label className="cp-label">Price (₹)</label>
      <input
        type="number"
        name="price"
        value={form.price}
        onChange={handleChange}
        placeholder="Enter price"
        min="0"
        className={getInputClass("price")}
        disabled={isSubmitting}
      />
      {errors.price && <span className="cp-error-text">{errors.price}</span>}
    </div>

    <div className="cp-group">
      <label className="cp-label">Area</label>
      <input
        type="number"
        name="area"
        value={form.area}
        onChange={handleChange}
        placeholder="Enter area"
        min="0"
        className={getInputClass("area")}
        disabled={isSubmitting}
      />
      {errors.area && <span className="cp-error-text">{errors.area}</span>}
    </div>

    <div className="cp-group">
      <label className="cp-label">Area Unit</label>
      <select
        name="areaUnit"
        value={form.areaUnit}
        onChange={handleChange}
        className={getSelectClass("areaUnit")}
        disabled={isSubmitting}
      >
        <option value="sqft">Square Feet</option>
        <option value="acre">Acre</option>
      </select>

      {errors.areaUnit && (
        <span className="cp-error-text">{errors.areaUnit}</span>
      )}
    </div>
  </div>

  <div className="cp-row">
    <div className="cp-group">
      <label className="cp-label">Bedrooms</label>
      <input
        type="number"
        name="bedrooms"
        value={form.bedrooms}
        onChange={handleChange}
        placeholder="0"
        min="0"
        className={getInputClass("bedrooms")}
        disabled={isSubmitting}
      />
      {errors.bedrooms && (
        <span className="cp-error-text">{errors.bedrooms}</span>
      )}
    </div>

    <div className="cp-group">
      <label className="cp-label">Bathrooms</label>
      <input
        type="number"
        name="bathrooms"
        value={form.bathrooms}
        onChange={handleChange}
        placeholder="0"
        min="0"
        className={getInputClass("bathrooms")}
        disabled={isSubmitting}
      />
      {errors.bathrooms && (
        <span className="cp-error-text">{errors.bathrooms}</span>
      )}
    </div>
  </div>
</div>
          {/* Section 4: Amenities */}
          <div className="cp-section">
            <h2 className="cp-section-title">Amenities</h2>
            <div className="cp-amenities-grid">
              {AMENITIES_LIST.map((amenity) => (
                <div
                  key={amenity}
                  className={`cp-chip ${form.amenities.includes(amenity) ? 'selected' : ''}`}
                  onClick={() => !isSubmitting && handleAmenityToggle(amenity)}
                >
                  {amenity}
                </div>
              ))}
            </div>
          </div>
          {/* Section 5: Property Images */}
          <div className="cp-section">
            <h2 className="cp-section-title">Property Images</h2>
            <div 
              className={`cp-upload-area ${isDragOver ? 'dragover' : ''} ${errors.images ? 'error' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => !isSubmitting && fileInputRef.current?.click()}
            >
              <svg className="cp-upload-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div className="cp-upload-text">Drag & Drop Images</div>
              <div className="cp-upload-subtext">or click to browse (Max 6)</div>
              <input 
                type="file"
                ref={fileInputRef}
                onChange={handleFileInput}
                multiple
                accept="image/*"
                style={{ display: 'none' }}
                disabled={isSubmitting}
              />
            </div>
            {errors.images && <span className="cp-error-text">{errors.images}</span>}
            {form.images.length > 0 && (
              <div className="cp-image-preview-grid">
                {form.images.map((file, index) => (
                  <div key={index} className="cp-image-preview">
                    <img src={URL.createObjectURL(file)} alt={`Preview ${index}`} />
                    <button 
                      type="button" 
                      className="cp-remove-img" 
                      onClick={(e) => { e.stopPropagation(); removeImage(index); }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Submit Section */}
          <div className="cp-submit-section">
            <button 
              type="submit" 
              className="cp-btn-primary" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="cp-spinner" aria-hidden="true" />
                  Submitting...
                </>
              ) : (
                'Submit Property'
              )}
            </button>
            <p className="cp-helper-text">
              Your property will remain in Pending status until approved by an administrator.
            </p>
          </div>
        </form>
      </div>
      {showSuccessModal && (
  <div className="cp-modal-overlay">
    <div className="cp-success-modal">
      <div className="cp-success-icon">
        ✓
      </div>

      <h2>Property Submitted!</h2>

      <p>
        Your property has been created successfully.
        <br />
        It is now waiting for admin approval before it becomes visible to buyers.
      </p>

      <button
        onClick={() => setShowSuccessModal(false)}
        className="cp-btn-primary"
      >
        Okay
      </button>
    </div>
  </div>
)}
    </div>
  );
};

export default CreateProperty;