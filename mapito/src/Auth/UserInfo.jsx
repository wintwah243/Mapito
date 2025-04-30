import React, { useState, useEffect } from 'react';
import { FiEdit, FiArrowLeft, FiSave, FiX } from 'react-icons/fi';
import CharAvatar from '../utils/CharAvatar';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';
import Navbar from '../components/Navbar';

const UserInfo = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editingName, setEditingName] = useState(false);
  const [editingBio, setEditingBio] = useState(false);
  const [editingProfilePic, setEditingProfilePic] = useState(false);

  const [newName, setNewName] = useState('');
  const [newBio, setNewBio] = useState('');
  const [newProfilePic, setNewProfilePic] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.AUTH.GET_USER_INFO);
        const userData = response.data;
        
        setUser(userData);
        setNewName(userData.fullName || '');
        setNewBio(userData.bio || '');
        localStorage.setItem('user', JSON.stringify(userData));
      } catch (err) {
        const localUser = JSON.parse(localStorage.getItem('user') || '{}');
        if (localUser) {
          setUser(localUser);
          setNewName(localUser.fullName || '');
          setNewBio(localUser.bio || '');
        } else {
          setError('Failed to fetch user data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handleGoBack = () => {
    navigate('/dashboard');
  };

  const handleSubmitProfileUpdate = async (fields) => {
    try {
      const response = await axiosInstance.put(
        API_PATHS.AUTH.UPDATE_PROFILE,
        fields
      );

      const updatedUser = {
        ...user,
        ...response.data
      };

      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      window.dispatchEvent(new Event('profileUpdated'));
      return true;
    } catch (err) {
      console.error('Error updating profile:', err.response || err.message);
      setError(err.response?.data?.message || 'Failed to update profile');
      return false;
    }
  };

  const handleSubmitName = async (e) => {
    e.preventDefault();
    setError('');

    if (!newName.trim()) {
      setError('Name is required');
      return;
    }

    const success = await handleSubmitProfileUpdate({ name: newName });
    if (success) {
      setEditingName(false);
    }
  };

  const handleSubmitBio = async (e) => {
    e.preventDefault();
    const success = await handleSubmitProfileUpdate({ bio: newBio });
    if (success) {
      setEditingBio(false);
    }
  };

  const handleSubmitProfilePic = async (e) => {
    e.preventDefault();
    if (!newProfilePic) return;

    const formData = new FormData();
    formData.append('profilePic', newProfilePic);

    try {
      const response = await axiosInstance.put(
        API_PATHS.AUTH.UPDATE_PROFILE_PIC, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const updatedUser = {
        ...user,
        profileImageUrl: `${response.data.profileImageUrl}?t=${Date.now()}`
      };

      setUser(updatedUser);
      setEditingProfilePic(false);
      setNewProfilePic(null);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      window.dispatchEvent(new Event('profileUpdated'));
    } catch (err) {
      console.error(err);
      setError('Failed to update profile picture');
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-gray-200 h-24 w-24"></div>
                <div className="space-y-2">
                  <div className="h-6 bg-gray-200 rounded w-32"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-1/5"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={handleGoBack}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <FiArrowLeft className="mr-2" />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-xl shadow-md overflow-hidden mt-9">
          <div className="bg-indigo-700 p-6">
            <div className="flex flex-col sm:flex-row items-center">
              <div className="relative group mb-4 sm:mb-0">
                {user?.profileImageUrl ? (
                  <img
                    src={user.profileImageUrl}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <CharAvatar
                    fullName={user?.fullName || ''}
                    width="w-24"
                    height="h-24"
                    style="text-3xl"
                    className="border-4 border-white shadow-lg"
                  />
                )}
                <button
                  onClick={() => setEditingProfilePic(true)}
                  className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition"
                >
                  <FiEdit className="text-gray-700" />
                </button>
              </div>

              <div className="sm:ml-6 text-center sm:text-left">
                <h1 className="text-2xl font-bold text-white">
                  {user?.fullName || 'No name provided'}
                </h1>
                <p className="text-blue-100">{user?.email || 'No email provided'}</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md mb-6">
                {error}
              </div>
            )}

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </h3>
                {!editingName ? (
                  <button
                    onClick={() => setEditingName(true)}
                    className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
                  >
                    <FiEdit className="mr-1" />
                    Edit
                  </button>
                ) : (
                  <button
                    onClick={() => setEditingName(false)}
                    className="text-gray-500 hover:text-gray-700 flex items-center text-sm"
                  >
                    <FiX className="mr-1" />
                    Cancel
                  </button>
                )}
              </div>

              {editingName ? (
                <form onSubmit={handleSubmitName} className="space-y-3">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <button
                    type="submit"
                    className="flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                  >
                    <FiSave className="mr-2" />
                    Save Changes
                  </button>
                </form>
              ) : (
                <p className="text-lg text-gray-800">
                  {user?.fullName || 'No name provided'}
                </p>
              )}
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Bio
                </h3>
                {!editingBio ? (
                  <button
                    onClick={() => setEditingBio(true)}
                    className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
                  >
                    <FiEdit className="mr-1" />
                    Edit
                  </button>
                ) : (
                  <button
                    onClick={() => setEditingBio(false)}
                    className="text-gray-500 hover:text-gray-700 flex items-center text-sm"
                  >
                    <FiX className="mr-1" />
                    Cancel
                  </button>
                )}
              </div>

              {editingBio ? (
                <form onSubmit={handleSubmitBio} className="space-y-3">
                  <textarea
                    value={newBio}
                    onChange={(e) => setNewBio(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                    placeholder="Tell us about yourself"
                  />
                  <button
                    type="submit"
                    className="flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                  >
                    <FiSave className="mr-2" />
                    Save Changes
                  </button>
                </form>
              ) : (
                <p className="text-gray-700">
                  {user?.bio || 'No bio provided'}
                </p>
              )}
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                Email
              </h3>
              <p className="text-gray-800">{user?.email || 'No email provided'}</p>
            </div>
          </div>

          {editingProfilePic && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div 
                className="fixed inset-0 bg-black opacity-50"
                onClick={() => {
                  setEditingProfilePic(false);
                  setNewProfilePic(null);
                }}
              ></div>
              
              <div className="bg-white p-6 rounded-xl shadow-lg w-96 relative z-50 mx-4">
                <button
                  onClick={() => {
                    setEditingProfilePic(false);
                    setNewProfilePic(null);
                  }}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                  <FiX size={20} />
                </button>
                
                <h2 className="text-lg font-semibold mb-4">Update Profile Picture</h2>
                
                <form onSubmit={handleSubmitProfilePic}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setNewProfilePic(e.target.files?.[0] || null)}
                    className="mb-4 w-full border border-gray-300 p-2 rounded"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                  >
                    Save Picture
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UserInfo;