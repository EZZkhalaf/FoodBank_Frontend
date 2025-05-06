
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CiBookmarkPlus } from "react-icons/ci";
import { IoMdBookmark } from "react-icons/io";
import { Clock, Utensils } from 'lucide-react';
import { useAuthContext } from '../Context/AuthContext';
import defaultRecipeImage from '../assets/defaultRecipeImage.jpg';

const RecipeElementFeed = ({
  RecipeId,
  recipe_image,
  recipe_name,
  recipe_description,
  recipeType,
  cookingTime,
  difficulty,
  recipe_user
}) => {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [displayedImage, setDisplayedImage] = useState(recipe_image || defaultRecipeImage);
  const [error, setError] = useState(null);
  const { user } = useAuthContext();
  const recipeUserId = recipe_user[0];
  const [recipeOwner, setRecipeOwner] = useState(null);

  useEffect(() => {
    if (recipe_image) {
      const isBase64 = /^data:image\/(png|jpe?g|gif|webp);base64,/.test(recipe_image);
      setDisplayedImage(isBase64 ? recipe_image : defaultRecipeImage);
    } else {
      setDisplayedImage(defaultRecipeImage);
    }
  }, [recipe_image]);

  useEffect(() => {
    const checkSavedStatus = async () => {
      try {
        const response = await fetch('http://localhost:3000/user/checkSave', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user._id, recipeId: RecipeId })
        });
        const data = await response.json();
        setSaved(data === 'saved');
      } catch (error) {
        console.error("Error checking saved status:", error);
        setError(error.message);
      }
    };

    const getTheOwnerData = async () => {
      try {
        const response = await fetch("http://localhost:3000/user/getUserById", {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: recipeUserId })
        });

        if (!response.ok) throw new Error(`Failed to fetch user data: ${response.statusText}`);
        const data = await response.json();
        setRecipeOwner(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError(error.message);
      }
    };

    if (user?._id) {
      getTheOwnerData();
      checkSavedStatus();
    }
  }, [user?._id, RecipeId]);

  const handleBookmark = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (loading) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/user/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentUserid: user._id, RecipeId })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setSaved(true);
    } catch (error) {
      console.error("Error saving bookmark:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUnBookmark = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (loading) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/user/unsave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentUserid: user._id, RecipeId })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setSaved(false);
    } catch (error) {
      console.error("Error unsaving bookmark:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  
  return (   <Link
    to={`/recipe/${RecipeId}`}
    className="block rounded-xl overflow-hidden shadow-sm group hover:shadow-lg transition-shadow duration-700 transform hover:scale-101 bg-white"
  >
    <div className="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden">
      {/* Header: avatar and username */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center">
          <img
            src={recipeOwner?.avatar || defaultRecipeImage}
            alt={`${recipeOwner?.username || 'User'} avatar`}
            className="w-10 h-10 rounded-full object-cover"
          />
          <span className="ml-3 font-semibold text-gray-900">
            {recipeOwner?.username || 'Unknown'}
          </span>
        </div>
        {/* Optional time display */}
        {/* <span className="text-sm text-gray-500">{someTimeAgoLogic}</span> */}
      </div>
  
      {/* Recipe image */}
      <div className="relative">
        <img
          src={displayedImage}
          alt={recipe_name}
          className="w-full h-64 object-cover transition-opacity duration-700 ease-in-out"
        />
      </div>
  
      {/* Recipe content */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={saved ? handleUnBookmark : handleBookmark}
              className="
                inline-flex            /* shrink to content */
                items-center           /* center icon vertically */
                justify-center         /* center icon horizontally */
                bg-white bg-opacity-75 
                p-2                     /* padding for tap area */
                rounded-full 
                transform 
                transition-all 
                duration-300 
                ease-out 
                hover:scale-110         /* grow on hover */
                hover:bg-opacity-100
                shadow                  /* subtle default depth */
                hover:shadow-lg         /* stronger hover depth */
              "
            >
              {saved ? (
                <IoMdBookmark className="text-blue-600 text-xl" />
              ) : (
                <CiBookmarkPlus className="text-gray-600 text-xl" />
              )}
            </button>
            <h2 className="text-xl font-bold text-gray-900 ml-3">{recipe_name}</h2>
          </div>
        </div>
        <p className="mt-1 text-gray-700 line-clamp-3">{recipe_description}</p>
        <div className="mt-3 flex flex-wrap items-center text-sm text-gray-500 gap-x-3 gap-y-1">
          <span className="flex items-center"><Utensils className="w-4 h-4 mr-1" /> {recipeType}</span>
          <span className="flex items-center"><Clock className="w-4 h-4 mr-1" /> {cookingTime} mins</span>
          <span>{difficulty}</span>
        </div>
      </div>
    </div>
  </Link>
  );
};

export default RecipeElementFeed;

