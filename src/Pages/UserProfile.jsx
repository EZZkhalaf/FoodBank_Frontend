


import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../Context/AuthContext';
import defaultPhoto from '../assets/defaultPhoto.png'; 
import ProfileRecipeElement from '../Components/profileRecipeElement';
import { IoMdSettings } from "react-icons/io";
import Footer from '../Components/Footer';
import NavBar from '../Components/NavBar';


const UserProfile = () => {
  const { user, dispatch } = useAuthContext();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const {
    username,
    bio,
    profilePic,
    friends,
    followers,
    following,
    ownRecipes,
    savedRecipes,
  } = user || {};
  

  let userProfilePic = profilePic && profilePic !== "/assets/defaultPhoto.png" ? profilePic : defaultPhoto;

  useEffect(() => {
    const fetchUserRecipes = async () => {
      if (!user?._id) return;

      setLoading(true);
      try {
        const res = await fetch(`http://localhost:3000/recipe/getUserRecipes/${user._id}`);
        
        if (!res.ok) {
          throw new Error(`Error: ${res.statusText}`);
        }

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
  }, [user?._id]);




  useEffect(() => {
    if (!user?._id) return;

    const fetchUserData = async () => {
      try {
        const res = await fetch(`http://localhost:3000/user/${user._id}`);
        if (!res.ok) throw new Error(`Error: ${res.statusText}`);

        const updatedUser = await res.json();
        dispatch({ type: 'SET_USER', payload: updatedUser });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
    const interval = setInterval(fetchUserData, 10000);
    return () => clearInterval(interval);
  }, [user?._id]);

  if (loading) return <div>Loading...</div>;
  return (
    <div className='flex flex-col min-h-screen bg-sand-50'>
      <div className='bg-white rounded-xl  p-8'>
      <NavBar />
        <div className='flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8 mt-10'>
          {/* Profile Picture */}
          <img
            src={userProfilePic}
            alt={`${username}'s profile`} 
            className='w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg'
          />
  
          {/* User Info */}
          <div className='text-center md:text-left'>
            <h1 className='text-3xl font-bold text-gray-800'>{username || "Guest"}</h1>
            <p className='text-gray-600 mt-2'>{bio || "No bio available"}</p>
          </div>
  
          {/* Action Buttons */}
          {/* Container for the settings button */}
          <div className="relative ">
            {/* Settings Button */}
            <button
              onClick={() => {}}
              className="p-3 bg-gray-500 text-white rounded-lg shadow-md hover:bg-gray-600 focus:outline-none"
            >
              <IoMdSettings size={18} />
            </button>

  
          </div>
        </div>
  
        {/* Social Stats */}
        <div className='grid grid-cols-3 md:grid-cols-3 gap-4 mt-8 text-center'>
          <div className='p-4 bg-gray-50 rounded-lg'>
            <p className='text-xl font-bold text-gray-800'>{followers?.length || 0}</p>
            <p className='text-gray-600'>Followers</p>
          </div>
  
          <div className='p-4 bg-gray-50 rounded-lg'>
            <p className='text-xl font-bold text-gray-800'>{following?.length || 0}</p>
            <p className='text-gray-600'>Following</p>
          </div>
  
          <div className='p-4 bg-gray-50 rounded-lg'>
            <p className='text-xl font-bold text-gray-800'>{ownRecipes?.length || 0}</p>
            <p className='text-gray-600'>Recipes</p>
          </div>
        </div>
        <div className='flex justify-center items-center mt-10'>

        <div className="w-[40vw] border-t-2 border-sand-200"></div>
        </div>

        {/* Recipes Section */}
        <div className='mt-12'>
          <div className='flex justify-between items-center'>
            <h2 className='text-2xl font-bold text-gray-800 mb-6'>Recipes</h2>
            <button
              onClick={() => {}}
              className='px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600'
            >
              Create Recipe
            </button>
          </div>
  
          {/* Own Recipes */}
          <div className='mb-8'>
            <h3 className='text-xl font-semibold text-gray-700 mb-4'>My Recipes</h3>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
              {recipes.length > 0 ? (
                recipes.map((recipe) => (
                  <ProfileRecipeElement
                    key={recipe._id}
                    RecipeId={recipe._id}
                    recipe_image={recipe.recipe_image}
                    recipe_name={recipe.recipe_title}
                    recipe_description={recipe.recipe_description}
                    recipeType={recipe.type} 
                    cookingTime={recipe.cookingTime}
                    difficulty={recipe.difficullty}
                  />
                ))
              ) : (
                <p className='text-gray-600'>No recipes created yet.</p>
              )}
            </div>
          </div>
        </div>
  
        {/* Edit Profile Form */}
        {isEditing && (
          <form className='space-y-4 mt-6'>
            <div>
              <label className='block text-gray-600 mb-2' htmlFor='username'>Username</label>
              <input 
                type='text' 
                id='username' 
                value={username} 
                onChange={(e) => dispatch({ type: 'SET_USER', payload: { ...user, username: e.target.value } })}
                className='w-full p-2 border border-gray-300 rounded-md'
              />
            </div>
            <div>
              <label className='block text-gray-600 mb-2' htmlFor='bio'>Bio</label>
              <textarea 
                id='bio'
                value={bio}
                onChange={(e) => dispatch({ type: 'SET_USER', payload: { ...user, bio: e.target.value } })}
                className='w-full p-2 border border-gray-300 rounded-md'
              />
            </div>
            <div className='flex justify-center'>
              <button 
                type='submit'
                className='px-6 py-2 bg-green-500 text-white rounded-md'
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>
      <Footer/>
    </div>
  );
  
};

export default UserProfile;
