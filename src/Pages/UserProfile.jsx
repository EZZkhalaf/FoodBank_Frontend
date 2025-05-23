

import React, { useEffect, useRef, useState } from 'react';
import { useAuthContext } from '../Context/AuthContext';
import defaultPhoto from '../assets/defaultPhoto.png';
import ProfileRecipeElement from '../Components/profileRecipeElement';
import { IoMdSettings } from "react-icons/io";
import Footer from '../Components/Footer';
import { useNavigate } from 'react-router-dom';
import NavBar from '../Components/NavBar';
import ProfileNavBar from '../Components/ProfileNavBar';
import { ThreeDot } from 'react-loading-indicators';
import UserFollowModal from '../Components/UserFollowModal';

const UserProfile = () => {
  const { user, dispatch } = useAuthContext();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const {
    username,
    bio,
    profilePic,
    followers,
    following,
    ownRecipes,
  } = user || {};

  const [profileUsername, setProfileUsername] = useState(username || "");
  const [profileBio, setProfileBio] = useState(bio || "");
  const [previewImage, setPreviewImage] = useState(profilePic || defaultPhoto);
  
  const fileInputRef = useRef(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 9;
  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = recipes.slice(indexOfFirstRecipe, indexOfLastRecipe);
  const totalPages = Math.ceil(recipes.length / recipesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const next_page = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const previousPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  //for displaying the followers and following in a modal 
  const [showModal , setShowModal] = useState(false);
  const [modalUsers , setModalUsers] = useState([]);
  const [modalTitle , setModalTitle] = useState("");
  //for testing the design of the modal 
  const sampleUsers = [
    { _id: "1", name: "Alice", profilePic: "https://i.pravatar.cc/100?img=1" },
    { _id: "2", name: "Bob", profilePic: "https://i.pravatar.cc/100?img=2" },
  ];


  const handleShowFollowers = () => {
    setModalUsers(user.followers || []);
    setModalTitle("Followers");
    setShowModal(true);
  };
  
  const handleShowFollowing = () => {
    setModalUsers(user.following || []);
    setModalTitle("Following");
    setShowModal(true);
  };




  // Helper function to determine which image to display
  const getProfileImage = () => {
    if (profilePic && profilePic !== "/assets/defaultPhoto.png") {
      return profilePic;
    }
    return defaultPhoto;
  };

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  useEffect(() => {
    const fetchUserRecipes = async () => {
      if (!user?._id) return;

      setLoading(true);
      try {
        const res = await fetch(`http://localhost:3000/recipe/getUserRecipes/${user._id}`);
        if (!res.ok) throw new Error(`Error: ${res.statusText}`);
        const data = await res.json();
        setRecipes(data);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      fetchUserRecipes();
    }
  }, [user]);

  const editUser = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('newUsername', profileUsername);
    formData.append('newBio', profileBio);
    formData.append('userId', user._id);
    formData.append('image', previewImage);

    try {
      const response = await fetch('http://localhost:3000/user/updateTheUserProfile', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating the user data:', error);
    }
  };

  // in UserProfile.jsx
  const fetchUserData = async (id) => {
    const res = await fetch('http://localhost:3000/user/getUserById', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: id }),
    });
    if (!res.ok) throw new Error(res.statusText);
    return res.json();
  };

  useEffect(() => {
    if (!user?._id) return;

    const refresh = async () => {
      try {
        const updated = await fetchUserData(user._id);
        dispatch({ type: 'SET_USER', payload: updated });
      } catch (err) {
        console.error('Error fetching user data:', err);
      }
    };

    refresh();
    const id = setInterval(refresh, 40000);
    return () => clearInterval(id);
  }, [user?._id, dispatch]);



  const handleProfilePicChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      const image64 = reader.result;
      setPreviewImage(image64);
    };
    reader.readAsDataURL(file);
  };


  // Pagination component
  const Pagination = () => {
    if (totalPages <= 1) return null;
    
    const maxDisplayedPages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxDisplayedPages / 2));
    let endPage = startPage + maxDisplayedPages - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxDisplayedPages + 1);
    }

    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex justify-center items-center mt-8 space-x-2">
        <button 
          onClick={previousPage} 
          disabled={currentPage === 1}
          className={`p-2 rounded-md ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-indigo-600 hover:bg-indigo-100'}`}
        >
          Previous
        </button>
        
        {startPage > 1 && (
          <>
            <button 
              onClick={() => paginate(1)} 
              className={`px-3 py-1 rounded-md ${currentPage === 1 ? 'bg-indigo-600 text-white' : 'text-indigo-600 hover:bg-indigo-100'}`}
            >
              1
            </button>
            {startPage > 2 && <span className="px-2">...</span>}
          </>
        )}
        
        {pageNumbers.map(number => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={`px-3 py-1 rounded-md ${currentPage === number ? 'bg-indigo-600 text-white' : 'text-indigo-600 hover:bg-indigo-100'}`}
          >
            {number}
          </button>
        ))}
        
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-2">...</span>}
            <button 
              onClick={() => paginate(totalPages)} 
              className={`px-3 py-1 rounded-md ${currentPage === totalPages ? 'bg-indigo-600 text-white' : 'text-indigo-600 hover:bg-indigo-100'}`}
            >
              {totalPages}
            </button>
          </>
        )}
        
        <button 
          onClick={next_page} 
          disabled={currentPage === totalPages}
          className={`p-2 rounded-md ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-indigo-600 hover:bg-indigo-100'}`}
        >
          Next
        </button>
      </div>
    );
  };


      useEffect(()=>{
      window.scrollTo({
        top:0 ,
        behavior:'smooth'
      });
    },[Pagination])



  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="p-6 rounded-lg shadow-md bg-white border border-gray-200">
        <ThreeDot color={["#32cd32", "#327fcd", "#cd32cd", "#cd8032"]} />
      </div>
    </div>
  );

  return (
    <div className='flex flex-col min-h-screen bg-sand-50 w-full'>
      <div className='bg-white rounded-xl w-full p-8'>
        <ProfileNavBar /> 
        {/* Profile Section */}
        <div className='flex flex-col md:flex-row items-center justify-between w-full mt-10'>
          {/* Left Section: Profile Picture and Info */}
          <div className="flex items-center space-x-6">
            {isEditing ? (
              <div className="flex items-center">
                <div className="flex">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePicChange}
                    ref={fileInputRef}
                    className="hidden"
                  />
                  {/* Clickable profile picture */}
                  <img
                    src={previewImage || defaultPhoto}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg cursor-pointer"
                    onClick={() => fileInputRef.current.click()}
                    onError={(e) => {
                      e.target.src = defaultPhoto;
                    }}
                  />
                  <div className='flex flex-col'>
                    {/* Username Input */}
                    <div className="bg-gray-300 m-3 p-2 rounded-md hover:bg-gray-400 transition">
                      <input
                        type="text"
                        value={profileUsername}
                        placeholder="Enter username"
                        onChange={(e) => setProfileUsername(e.target.value)}
                        className="w-full bg-transparent p-2 focus:outline-none"
                      />
                    </div>
                    {/* Bio Input */}
                    <div className="bg-gray-300 m-3 p-2 rounded-md hover:bg-gray-400 transition">
                      <input
                        type="text"
                        value={profileBio}
                        placeholder="Enter your bio"
                        onChange={(e) => setProfileBio(e.target.value)}
                        className="w-full bg-transparent p-2 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
                {/* Submit Button */}
                <button
                  className="bg-blue-500 text-white font-semibold px-4 py-2 
                  rounded-md m-3 hover:bg-green-600 transition-all"
                  onClick={editUser}
                >
                  Submit
                </button>
              </div>
            ) : (
              <div className='text-center md:text-left flex'>
                <img
                  src={getProfileImage()}
                  alt={`${profileUsername}'s profile`}
                  className='w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg'
                  onError={(e) => {
                    e.target.src = defaultPhoto;
                  }}
                />
                <div className='flex flex-col items-center justify-center m-4'>
                  <h1 className='text-3xl font-bold text-gray-800'>{profileUsername}</h1>
                  <p className='text-gray-600 mt-2'>{profileBio}</p>
                </div>
              </div>
            )}
          </div>
          {/* Right Section: Settings Button */}
          <div className="ml-auto flex items-center">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-3 bg-gray-500 text-white rounded-lg shadow-md hover:bg-gray-600 focus:outline-none"
            >
              <IoMdSettings size={18} />
            </button>
          </div>
        </div>

        {/* Social Stats */}
        <div className='grid grid-cols-3 gap-4 mt-8 text-center'>
            <div 
              onClick={handleShowFollowers}
              className='p-4 bg-gray-50 rounded-lg'>
                <p className='text-xl font-bold text-gray-800'>{followers?.length || 0}</p>
                <p className='text-gray-600'>Followers</p>
            </div>
            <div 
            onClick={handleShowFollowing}
              className='p-4 bg-gray-50 rounded-lg'>
              <p className='text-xl font-bold text-gray-800'>{following?.length || 0}</p>
              <p className='text-gray-600'>Following</p>
            </div>
            <div className='p-4 bg-gray-50 rounded-lg'>
              <p className='text-xl font-bold text-gray-800'>{recipes?.length || 0}</p>
              <p className='text-gray-600'>Recipes</p>
            </div>
        </div>

        {showModal && (
          <UserFollowModal
            users={modalUsers}
            title={modalTitle}
            onClose={() => setShowModal(false)}
          />
        )}
        {/* Divider */}
        <div className='flex justify-center items-center mt-10'>
          <div className="w-[40vw] border-t-2 border-sand-200"></div>
        </div>

        {/* Recipes Section */}
        <div className='mt-12'>
          <div className='flex justify-between items-center'>
            <h2 className='text-2xl font-bold text-gray-800 mb-6'>Recipes</h2>
            <button
              onClick={() => navigate('/addRecipe')}
              className='px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600'
            >
              Create Recipe
            </button>
          </div>

          {/* Own Recipes */}
          <div className='mb-8'>
            <h3 className='text-xl font-semibold text-gray-700 mb-4'>My Recipes</h3>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
              {currentRecipes.length > 0 ? (
                currentRecipes.map((recipe) => (
                  <ProfileRecipeElement
                    key={recipe._id}
                    RecipeId={recipe._id}
                    recipe_image={recipe.recipe_image}
                    recipe_name={recipe.recipe_title}
                    recipe_description={recipe.recipe_description}
                    recipeType={recipe.type}
                    cookingTime={recipe.cookingTime}
                    difficulty={recipe.difficulty}
                  />
                ))
              ) : (
                <p className='text-gray-600'>No recipes created yet.</p>
              )}
            </div>

            {/* Pagination */}
            <Pagination />

            {/* Results count */}
            <div className="text-center mt-4 text-gray-600">
              Showing {indexOfFirstRecipe + 1}-
              {Math.min(indexOfLastRecipe, recipes.length)} of {recipes.length} recipes
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserProfile;