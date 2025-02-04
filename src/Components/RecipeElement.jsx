import React from 'react';
import { Link } from 'react-router-dom';

const RecipeElement = ({ RecipeId, recipe_image, recipe_name }) => {
  return (
    <Link
      to={`/recipe/${RecipeId}`} // Corrected URL formatting
      className="block transform transition-all hover:scale-105"
    >
      <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300">
        {/* Recipe Image */}
        <img 
          className="w-full h-auto object-cover transition-transform duration-300 hover:scale-105" 
          src={recipe_image} 
          alt={recipe_name} 
        />

        {/* Recipe Name */}
        <div className="p-4">
          <p className="text-lg font-semibold text-gray-800 text-center">{recipe_name}</p>
        </div>
      </div>
    </Link>
  );
};

export default RecipeElement;
