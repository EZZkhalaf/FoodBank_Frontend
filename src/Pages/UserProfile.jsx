


import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../Context/AuthContext';
import defaultPhoto from '../assets/defaultPhoto.png'; 
import ProfileRecipeElement from '../Components/profileRecipeElement';
import { IoMdSettings } from "react-icons/io";
import Footer from '../Components/Footer';
import NavBar from '../Components/NavBar';
import { useNavigate } from 'react-router-dom';


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
    friends,
    followers,
    following,
    ownRecipes,
    savedRecipes,
  } = user || {};
  
  const [profileUsername , setProfileUsername] = useState(username);
  const [profileBio , setProfileBio] = useState(bio)
  const [currentProfilePicture , setCurrentProfilePicture] = useState(profilePic);
  
  let userProfilePic = profilePic && profilePic !== "/assets/defaultPhoto.png" ? profilePic : defaultPhoto;
 
 
  useEffect(()=>{
    if(!user) navigate('/login')
  },[user,navigate]);

  useEffect(() => {
    
    const fetchUserRecipes = async () => {
      if (!user?._id) return ;

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


  const editUser = async(e) =>{
    e.preventDefault();
    try{
      const response = await fetch('http://localhost:3000/user/updateTheUserProfile' , {
        method: 'post',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({
          newUsername:profileUsername,
          newBio:profileBio,
          newPicture:'',
          userId:user._id
        })
      });

      const data = await response.json();
      console.log(data.message)

      dispatch({ type: 'SET_USER', payload: data.user });

    }catch(error){
      console.error('Error updating the user data:', error);
    }
  }

  useEffect(() => {
    if (!user._id) return;

    const fetchUserData = async () => {
      try {
        const res = await fetch(`http://localhost:3000/user/${user._id}`);

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
    <div className='flex flex-col min-h-screen bg-sand-50 w-fulll'>
      <div className='bg-white rounded-xl w-full  p-8'>
    
          
          <div className='flex flex-col md:flex-row items-center justify-between w-full mt-10'>
            {/* Left Section: Profile Picture and Info */}
            <div className="flex items-center space-x-6">

              {/* Profile Picture */}
              {/* <img
                src={userProfilePic}
                alt={`${username}'s profile`} 
                className='w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg'
                /> */}
              
                {isEditing &&(
                  <div className="flex items-center">
                      <div className="flex ">
                      <img
                        src={userProfilePic}
                        alt={`${username}'s profile`} 
                        className='w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg'
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
                        className="bg-green-500 text-white font-semibold
                         px-4 py-2 rounded-md m-3 hover:bg-green-600 transition-all"
                        onClick={e => editUser(e)}
                         >
                        Submit
                      </button>
                    </div>

                )} 
                
                 {!isEditing &&(
              
                   <div className='text-center md:text-left flex '>
                          <img
                            src={userProfilePic}
                            alt={`${username}'s profile`} 
                            className='w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg'
                            />
                          <div className='flex flex-col items-center justify-center m-4'>
        
                            <h1 className='text-3xl font-bold text-gray-800'>{profileUsername}</h1>
                            <p className='text-gray-600 mt-2'>{profileBio}</p>
     
                          </div>
     
                    </div>
                )}   
            </div>

            {/* Right Section: Settings Button */}
            <div className="ml-auto">
              <button
                onClick={() => {setIsEditing(!isEditing)}}
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
              <label
               className='block text-gray-600 mb-2'
                htmlFor='username'
                >
                  Username
                </label>
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
