import React, { useEffect, useState } from 'react';
import NavBar from '../Components/NavBar';
import { useNavigate } from 'react-router-dom';
import DisplayRecipes from '../Components/displayRecipes';
import Footer from '../Components/Footer';
import Hero from '../Components/Hero';
import { useAuthContext } from '../hooks/useAuthContext';

const Home = () => {
  const {user} = useAuthContext()
  const navigate = useNavigate();
  useEffect(()=>{
    if(!user){
      navigate('/login');
    }
  },[user,navigate])
 
  return (
    <div className="home-page flex flex-col min-h-screen bg-gray-100">
      {/* Fixed Navbar */}
      <NavBar />
      
      {/* Add margin-top to avoid overlap */}
      <div className="mt-24">
        <Hero user={user} />
      </div>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center flex-grow px-6 sm:px-8 md:px-12 lg:px-16 mt-24 w-full ">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-800 text-center mb-8">
          Here are some popular recipes: 🍽️
        </h1>
        <DisplayRecipes />
      </main>

      <div className="mt-4">
        <Footer />
      </div>
    </div>
  );
};

export default Home;
