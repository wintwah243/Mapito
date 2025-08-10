import React, { useState, useEffect } from 'react';
import { FiEdit, FiSave, FiX, FiAlertTriangle, FiGlobe, FiInstagram, FiTrash2 } from 'react-icons/fi';
import CharAvatar from '../utils/CharAvatar';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

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

   // account deleting
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    setDeleteError('');
    setIsDeleting(true);

    try {
      await axiosInstance.post(API_PATHS.AUTH.DELETE_ACCOUNT, { password: deletePassword });
      localStorage.clear();
      navigate('/login');
    } catch (err) {
  if (err.response?.status === 401) {
    // if password wrong, just show error message and no redirect
    setDeleteError(err.response.data.message || 'Incorrect password');
  } else {
    setDeleteError('Failed to delete account');
  } 
} finally{
  setIsDeleting(false);
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
      <div className="max-w-6xl mx-auto px-4 py-8 mb-20 mt-20 flex flex-col md:flex-row gap-6">
        {/* User Info Box - Left Column */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden flex-1">
          <div className="bg-gradient-to-r from-gray-600 to-blue-700 p-6">
            <div className="flex flex-col sm:flex-row items-center">
              <div className="relative group mb-4 sm:mb-0">
                {user?.profileImageUrl ? (
                  <img
                    src={user.profileImageUrl}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                  />
                ) : (
                  <CharAvatar
                    fullName={user?.fullName || ''}
                    width="w-24"
                    height="h-24"
                    style="text-3xl"
                    className="border-4 border-white shadow-md"
                  />
                )}
                <button
                  onClick={() => setEditingProfilePic(true)}
                  className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-sm hover:bg-gray-50 transition-all duration-200"
                  aria-label="Edit profile picture"
                >
                  <FiEdit className="text-gray-700 text-sm" />
                </button>
              </div>

              <div className="sm:ml-6 text-center sm:text-left">
                <h1 className="text-2xl font-semibold text-white">
                  {user?.fullName || 'No name provided'}
                </h1>
                <p className="text-blue-100">{user?.email || 'No email provided'}</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6">
                <p>{error}</p>
              </div>
            )}

            {/* Name Section */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </h3>
                {!editingName ? (
                  <button
                    onClick={() => setEditingName(true)}
                    className="text-blue-600 hover:text-blue-800 flex items-center text-sm transition-colors duration-200"
                  >
                    <FiEdit className="mr-1" size={14} />
                    Edit
                  </button>
                ) : (
                  <button
                    onClick={() => setEditingName(false)}
                    className="text-gray-500 hover:text-gray-700 flex items-center text-sm transition-colors duration-200"
                  >
                    <FiX className="mr-1" size={14} />
                    Cancel
                  </button>
                )}
              </div>

              {editingName ? (
                <form onSubmit={handleSubmitName} className="space-y-4">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    required
                    autoFocus
                  />
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      className="flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
                    >
                      <FiSave className="mr-2" size={14} />
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingName(false)}
                      className="flex items-center justify-center bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <p className="text-lg font-medium text-gray-800">
                  {user?.fullName || 'No name provided'}
                </p>
              )}
            </div>

            {/* Bio Section */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bio
                </h3>
                {!editingBio ? (
                  <button
                    onClick={() => setEditingBio(true)}
                    className="text-blue-600 hover:text-blue-800 flex items-center text-sm transition-colors duration-200"
                  >
                    <FiEdit className="mr-1" size={14} />
                    Edit
                  </button>
                ) : (
                  <button
                    onClick={() => setEditingBio(false)}
                    className="text-gray-500 hover:text-gray-700 flex items-center text-sm transition-colors duration-200"
                  >
                    <FiX className="mr-1" size={14} />
                    Cancel
                  </button>
                )}
              </div>

              {editingBio ? (
                <form onSubmit={handleSubmitBio} className="space-y-4">
                  <textarea
                    value={newBio}
                    onChange={(e) => setNewBio(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    rows="4"
                    placeholder="Tell us about yourself..."
                    autoFocus
                  />
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      className="flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
                    >
                      <FiSave className="mr-2" size={14} />
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingBio(false)}
                      className="flex items-center justify-center bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <p className="text-gray-700 whitespace-pre-line">
                  {user?.bio || 'No bio provided'}
                </p>
              )}
            </div>

            {/* Email Section (non-editable) */}
            <div className="mb-6">
              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                Email
              </h3>
              <p className="text-gray-800 font-medium">{user?.email || 'No email provided'}</p>
            </div>
          </div>
        </div>

        {/* Options Box - Right Column */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden w-full md:w-80 h-fit">
          <div className="p-6">
            {/* General Section */}
            <div className="mb-6">
              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3 flex items-center">
                General
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="mailto:wahwint72@gmail.com?subject=Report%20a%20Problem%20For%20Mapito"
                    className="text-blue-600 hover:text-blue-800 flex items-center transition-colors duration-200"
                  >
                    <FiAlertTriangle className="mr-2" size={14} />
                    Report a Problem
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:wahwint72@gmail.com?subject=Feature%20Request%20For%20Mapito"
                    className="text-blue-600 hover:text-blue-800 flex items-center transition-colors duration-200"
                  >
                    <FiEdit className="mr-2" size={14} />
                    Request a Feature
                  </a>
                </li>
              </ul>
            </div>

            {/* About Section */}
            <div className="mb-6">
              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3 flex items-center">
                Connect
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="https://shiportfolio.onrender.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 flex items-center transition-colors duration-200"
                  >
                    <FiGlobe className="mr-2" size={14} />
                    Visit Our Website
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.instagram.com/shi1_shi4/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 flex items-center transition-colors duration-200"
                  >
                    <FiInstagram className="mr-2" size={14} />
                    Follow on Instagram
                  </a>
                </li>
              </ul>
            </div>

            {/* Danger Section */}
            <div>
              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3 flex items-center">
                Danger Zone
              </h3>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="text-red-600 hover:text-red-800 flex items-center transition-colors duration-200"
              >
                <FiTrash2 className="mr-2" size={14} />
                Delete Account
              </button>
            </div>
          </div>
        </div>

        {/* Profile Picture Modal */}
        {editingProfilePic && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
              onClick={() => {
                setEditingProfilePic(false);
                setNewProfilePic(null);
              }}
            ></div>

            <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative z-50 transform transition-all">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Update Profile Picture</h2>
                  <button
                    onClick={() => {
                      setEditingProfilePic(false);
                      setNewProfilePic(null);
                    }}
                    className="text-gray-400 hover:text-gray-500 transition-colors duration-200"
                    aria-label="Close"
                  >
                    <FiX size={20} />
                  </button>
                </div>

                <form onSubmit={handleSubmitProfilePic} className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Choose an image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setNewProfilePic(e.target.files?.[0] || null)}
                      className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100
                      cursor-pointer
                      border border-gray-200 rounded-md"
                      required
                    />
                  </div>
                  <div className="flex justify-end space-x-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProfilePic(false);
                        setNewProfilePic(null);
                      }}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-200"
                    >
                      Save Picture
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowDeleteModal(false)}
            ></div>

            <div className="bg-white rounded-lg shadow-xl w-full max-w-md z-50 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Delete Account</h2>
              <p className="text-sm text-gray-600 mb-4">
                Please enter your password to confirm account deletion. This action cannot be undone.
              </p>

              {deleteError && <p className="text-red-500 text-sm mb-3">{deleteError}</p>}

              <form onSubmit={handleDeleteAccount} className="space-y-4">
                <input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  required
                />

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowDeleteModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isDeleting}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                  >
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>

      <Footer />
    </>
  );

};

export default UserInfo;
