import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { BsCalendarDate, BsUpload, BsCardImage } from 'react-icons/bs';
import { FiSave, FiX } from 'react-icons/fi';

const AddChild: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: '',
    gender: 'female',
    birthWeight: '',
    birthWeightUnit: 'lb',
    birthHeight: '',
    birthHeightUnit: 'in',
    profileImage: null as File | null,
  });
  
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenderChange = (gender: string) => {
    setFormData(prev => ({ ...prev, gender }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({ ...prev, profileImage: file }));
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create a new child object
    const newChild = {
      id: Date.now().toString(),
      name: formData.name,
      age: "Just added",
      recentMilestone: "",
      upcomingEvent: {
        type: "",
        date: "",
      },
      hasProfileImage: !!previewUrl,
      color: formData.gender === 'female' ? 'gradient-pink' : 
             formData.gender === 'male' ? 'gradient-blue' : 'gradient-purple',
      emoji: formData.gender === 'female' ? '👶🏻' :
             formData.gender === 'male' ? '👶🏽' : '👶',
      profileImageUrl: previewUrl || undefined,
      dateOfBirth: formData.dateOfBirth,
    };
    
    // Get existing children from localStorage or use empty array if none exist
    const existingChildrenString = localStorage.getItem('babybloom-children');
    const existingChildren = existingChildrenString ? JSON.parse(existingChildrenString) : [];
    
    // Add new child to the array
    const updatedChildren = [...existingChildren, newChild];
    
    // Save back to localStorage
    localStorage.setItem('babybloom-children', JSON.stringify(updatedChildren));
    
    console.log('Child added:', newChild);
    
    // Navigate back to home after successful submission
    navigate('/');
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg baby-pattern-dots">
      <Navbar title="Add New Child" showBackButton={true} />
      
      <div className="p-5 max-w-xl mx-auto">
        <div className="bg-white dark:bg-dark-card rounded-xl shadow-soft animate-fade-in-up mb-6 overflow-hidden">
          <div className="h-2 gradient-primary"></div>
          <div className="p-6">
            <div className="flex items-center mb-5">
              <div className="w-10 h-10 gradient-primary rounded-full flex items-center justify-center mr-3 shadow-glow">
                <BsCardImage className="text-white animate-pulse-gentle" />
              </div>
              <h3 className="font-display font-bold text-xl bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">New Child Profile</h3>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Create a profile for your little one to start tracking their growth and development journey
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Child's Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your child's name"
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow-pressed focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="dateOfBirth" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  <BsCalendarDate className="inline mr-2 text-primary" />
                  Date of Birth
                </label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow-pressed focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Gender
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <div 
                    className={`p-3 text-center rounded-xl cursor-pointer transition-all flex flex-col items-center justify-center ${
                      formData.gender === 'female' 
                      ? 'bg-gradient-to-r from-pink-400 to-pink-500 text-white shadow-glow' 
                      : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:-translate-y-1 active:translate-y-0'
                    }`}
                    onClick={() => handleGenderChange('female')}
                  >
                    <span className={`text-2xl mb-1 ${formData.gender === 'female' ? 'animate-pulse-gentle' : ''}`}>👧</span>
                    <span className="font-medium">Female</span>
                  </div>
                  <div 
                    className={`p-3 text-center rounded-xl cursor-pointer transition-all flex flex-col items-center justify-center ${
                      formData.gender === 'male' 
                      ? 'bg-gradient-to-r from-blue-400 to-blue-500 text-white shadow-glow' 
                      : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:-translate-y-1 active:translate-y-0'
                    }`}
                    onClick={() => handleGenderChange('male')}
                  >
                    <span className={`text-2xl mb-1 ${formData.gender === 'male' ? 'animate-pulse-gentle' : ''}`}>👦</span>
                    <span className="font-medium">Male</span>
                  </div>
                  <div 
                    className={`p-3 text-center rounded-xl cursor-pointer transition-all flex flex-col items-center justify-center ${
                      formData.gender === 'other' 
                      ? 'bg-gradient-to-r from-purple-400 to-purple-500 text-white shadow-glow' 
                      : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:-translate-y-1 active:translate-y-0'
                    }`}
                    onClick={() => handleGenderChange('other')}
                  >
                    <span className={`text-2xl mb-1 ${formData.gender === 'other' ? 'animate-pulse-gentle' : ''}`}>👶</span>
                    <span className="font-medium">Other</span>
                  </div>
                </div>
              </div>
              
              <div>
                <label htmlFor="birthWeight" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Birth Weight (optional)
                </label>
                <div className="flex">
                  <input
                    type="number"
                    id="birthWeight"
                    name="birthWeight"
                    value={formData.birthWeight}
                    onChange={handleChange}
                    placeholder="Weight"
                    className="w-full p-3 rounded-l-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow-pressed focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    step="0.01"
                  />
                  <select
                    name="birthWeightUnit"
                    value={formData.birthWeightUnit}
                    onChange={handleSelectChange}
                    className="p-3 rounded-r-xl border border-l-0 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                  >
                    <option value="lb">lb</option>
                    <option value="kg">kg</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label htmlFor="birthHeight" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Birth Height (optional)
                </label>
                <div className="flex">
                  <input
                    type="number"
                    id="birthHeight"
                    name="birthHeight"
                    value={formData.birthHeight}
                    onChange={handleChange}
                    placeholder="Height"
                    className="w-full p-3 rounded-l-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow-pressed focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    step="0.01"
                  />
                  <select
                    name="birthHeightUnit"
                    value={formData.birthHeightUnit}
                    onChange={handleSelectChange}
                    className="p-3 rounded-r-xl border border-l-0 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                  >
                    <option value="in">in</option>
                    <option value="cm">cm</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Profile Image (optional)
                </label>
                <div className={`border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center transition-all ${previewUrl ? 'bg-gray-50 dark:bg-gray-800' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                  <input
                    type="file"
                    id="profileImage"
                    name="profileImage"
                    onChange={handleImageChange}
                    className="hidden"
                    accept="image/png, image/jpeg, image/jpg"
                  />
                  
                  {previewUrl ? (
                    <div className="flex flex-col items-center">
                      <div className="w-24 h-24 rounded-full overflow-hidden mb-3 shadow-soft hover:shadow-glow transition-all">
                        <img 
                          src={previewUrl} 
                          alt="Profile preview" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewUrl(null);
                          setFormData(prev => ({ ...prev, profileImage: null }));
                        }}
                        className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light text-sm mt-2 transition-colors"
                      >
                        Remove image
                      </button>
                    </div>
                  ) : (
                    <label htmlFor="profileImage" className="cursor-pointer block">
                      <div className="flex flex-col items-center justify-center">
                        <BsUpload className="text-2xl text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Drag and drop an image here or click to browse</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">PNG, JPG or JPEG (max. 5MB)</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => document.getElementById('profileImage')?.click()}
                        className="mt-3 text-primary dark:text-primary-light hover:underline text-sm transition-colors"
                      >
                        Select Image
                      </button>
                    </label>
                  )}
                </div>
              </div>
              
              <div className="flex space-x-3 pt-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:shadow-soft transition-all hover:-translate-y-1 active:translate-y-0 flex items-center justify-center"
                >
                  <FiX className="mr-2" />
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary text-white rounded-xl font-medium shadow-soft hover:shadow-glow transition-all hover:-translate-y-1 active:translate-y-0 flex items-center justify-center"
                >
                  <FiSave className="mr-2" />
                  Create Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddChild;
