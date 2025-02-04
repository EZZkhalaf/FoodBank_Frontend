

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './Pages/Home';
import Login from './Pages/Login';
import NavBar from './Components/NavBar';
import RecipeInfo from './Pages/RecipeInfo';
import UserProfile from './Pages/UserProfile';
import UserRecipes from './Pages/UserRecipes';
import { Component, useContext, useEffect, useState } from 'react';
import Register from './Pages/Register';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from './Context/AuthContext';

const App = () => {
  const navigate = useNavigate();
  const { user, dispatch } = useAuthContext();

  const loadUser = (data) => {
    console.log('Loaded user data:', data);  // Log full user data
    console.log('Profile Pic:', data.user.profilePic);  // Check if profilePic is being passed correctly
  
    dispatch({
      type: 'SET_USER',
      payload: {
        id: data.user._id,
        username: data.user.username,
        email: data.user.email,
        friends: data.user.friends,
        followers: data.user.followers,
        following: data.user.following,
        ownRecipes: data.user.ownRecipes,
        savedRecipes: data.user.savedRecipes,
        profilePic: data.profilePic,
        bio: data.user.bio,
      }
    });
  };
  
  

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      console.log('Stored user:', parsedUser);  // Log the user stored in localStorage
      if (!user) {
        loadUser(parsedUser);
        navigate('/');
      }
    }
  }, [user, dispatch, navigate]);

  useEffect(() => {
    // Check if user has an id after it's loaded from localStorage or set by context
    if (user && user._id) {
      console.log(`The logged-in user's ID is: ${user._id}`);
    } else {
      console.log('No user ID found');
    }
  }, [user]);

  return (
    <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login loadUser={loadUser} />} />
        <Route path='/register' element={<Register loadUser={loadUser} />} />
        <Route path='/recipe/:recipeId' element={<RecipeInfo />} />
        <Route path='/userprofile/:userId' element={<UserProfile />} />
        <Route path='/ownRecipes' element={<UserRecipes />} />
      </Routes>
    </div>
  );
}

export default App;
