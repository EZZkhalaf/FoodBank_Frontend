

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CiBookmarkPlus, CiBookmarkCheck } from "react-icons/ci";
import { useAuthContext } from '../Context/AuthContext';
import { IoMdBookmark } from "react-icons/io";


const RecipeElement = ({ RecipeId, recipe_image, recipe_name }) => {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const { user } = useAuthContext();

  useEffect(() => {
    const checkSavedStatus = async () => {
      try {
        const response  = await fetch('http://localhost:3000/user/checkSave', {
          method: 'post' ,
          headers:{'Content-Type' : 'application/json'},
          body : JSON.stringify({
            userId : user._id ,
            recipeId : RecipeId
          })
        });

        const data = await response.json();
        if(data === 'not saved') setSaved(false);
        if(data === 'saved') setSaved(true)
      } catch (error) {
        console.error("Error checking saved status:", error);
      }
    };

    checkSavedStatus();
  }, [user._id, RecipeId]); // Dependency array ensures it runs when user or recipe changes

  const handleBookmark = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/user/save', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentUserid: user._id,
          RecipeId: RecipeId
        })
      });

      const data = await response.json();
      if (data === 'already at the book marks') {
        console.log(data);
      } else {
        console.log(data.message);
        setSaved(true); // Mark as saved if successfully added
      }

    } catch (error) {
      console.error("Error saving bookmark:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnBookmark = async(e)=>{
    e.stopPropagation();
    e.preventDefault();

    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/user/unsave', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentUserid: user._id,
          RecipeId: RecipeId
        })
      });

      const data = await response.json();
      console.log(data)
      if (data.message === 'Recipe removed from saved recipes successfully.') {
        setSaved(false);
      } 

    } catch (error) {
      console.error("Error unsaving bookmark:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Link
        to={`/recipe/${RecipeId}`} 
        className="block transform transition-all hover:scale-105"
      >
        <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300">
          {/* Recipe Image */}
          <img 
            className="w-full h-auto object-cover transition-transform duration-300 hover:scale-105" 
            src={recipe_image} 
            alt={recipe_name} 
          />

          {/* Recipe Name & Bookmark */}
          <div className="p-4 flex justify-between items-center">
            <p className="text-lg font-semibold text-gray-800 text-center">{recipe_name}</p>

            {/* Conditional Rendering for Bookmark Icon */}
            {saved ? (
              <IoMdBookmark 
                onClick={handleUnBookmark}
                className="text-3xl text-green-600 hover:text-green-800 transition-colors duration-300 cursor-pointer"
              />
            ) : (
              <CiBookmarkPlus 
                onClick={handleBookmark}
                className={`text-3xl ${loading ? 'text-gray-400' : 'text-gray-700 hover:text-indigo-600'} transition-colors duration-300 cursor-pointer`} 
              />
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default RecipeElement;


