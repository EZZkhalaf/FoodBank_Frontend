


import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../Context/AuthContext';
import defaultPhoto from '../assets/defaultPhoto.png'; 
import ProfileRecipeElement from '../Components/profileRecipeElement';

const UserProfile = () => {
  const { user, dispatch } = useAuthContext(); // ✅ Ensure dispatch is available
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setOpen] = useState(false);

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
      if (!user?._id) return; // Prevent running if user is null

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
  }, [user?._id]); // ✅ Fix: Only run when `user._id` changes

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
  }, [user?._id]); // ✅ Fix: Added dependency for updates

  if (loading) return <div>Loading...</div>;

  return (
    <div className='w-full mx-5 xl:mx-auto max-w-6xl p-6'>
      <div className='bg-white rounded-xl shadow-lg p-8'>

        <div className='flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8'>
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
        </div>

        {/* Social Stats */}
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 text-center'>
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

        {/* Recipes Section */}
        <div className='mt-12'>
          <h2 className='text-2xl font-bold text-gray-800 mb-6'>Recipes</h2>

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
                  />
                ))
              ) : (
                <p className='text-gray-600'>No recipes created yet.</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UserProfile;
