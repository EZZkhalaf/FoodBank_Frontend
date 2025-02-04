import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Assuming you're using React Router for navigation
import { useAuthContext } from '../Context/AuthContext';
import defaultPhoto from '../assets/defaultPhoto.png'; 
import RecipeElement from '../Components/RecipeElement';

const UserProfile = () => {
  const { user } = useAuthContext();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

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
      if (!user?._id) return; // Simplified check for user._id
      
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:3000/recipe/getUserRecipes/${user._id}`);
        
        // Check if the response is okay (status code 200-299)
        if (!res.ok) {
          throw new Error(`Error: ${res.statusText}`);
        }
        
        const data = await res.json();
        setRecipes(data);
      } catch (error) {
        console.error('Error fetching recipes:', error);
        // You could also set some error state here to display to the user
      } finally {
        setLoading(false);
      }
    };
  
    if (user) {
      fetchUserRecipes();
    }
  }, [user]);
  

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
              <h1 className='text-3xl font-bold text-gray-800'>{username}</h1>
              <p className='text-gray-600 mt-2'>{bio}</p>
            </div>
        </div>



        {/* Social Stats */}
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 text-center'>
            <div className='p-4 bg-gray-50 rounded-lg'>
                <p className='text-xl font-bold text-gray-800'>{friends.length}</p>
                <p className='text-gray-600'>Friends</p>
            </div>

            <div className='p-4 bg-gray-50 rounded-lg'>
                <p className='text-xl font-bold text-gray-800'>{followers.length}</p>
                <p className='text-gray-600'>Followers</p>
            </div>

            <div className='p-4 bg-gray-50 rounded-lg'>
                <p className='text-xl font-bold text-gray-800'>{following.length}</p>
                <p className='text-gray-600'>Following</p>
            </div>

            <div className='p-4 bg-gray-50 rounded-lg'>
                <p className='text-xl font-bold text-gray-800'>{ownRecipes.length}</p>
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
                  <RecipeElement
                    key={recipe._id} // Add a unique key
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

          {/* Saved Recipes */}
          {/* <div>
            <h3 className='text-xl font-semibold text-gray-700 mb-4'>Saved Recipes</h3>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
              {savedRecipes.length > 0 ? (
                savedRecipes.map((recipe) => (
                  <Link
                    key={recipe._id}
                    to={`/recipes/${recipe._id}`} // Link to the recipe detail page
                    className='bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow'
                  >
                    <h4 className='text-lg font-medium text-gray-800'>{recipe.name}</h4>
                    <p className='text-gray-600 text-sm mt-2'>{recipe.description}</p>
                  </Link>
                ))
              ) : (
                <p className='text-gray-600'>No recipes saved yet.</p>
              )}
            </div> */}
          </div>
        </div>
      </div>
    
  );
};

export default UserProfile;