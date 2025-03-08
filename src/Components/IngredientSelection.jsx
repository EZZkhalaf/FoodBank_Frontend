import React, { useState } from 'react';
import IngredientElement from './ingredientElement';

const IngredientSelection = () => {
  const [showAll, setShowAll] = useState(false);

  // Static list of ingredients
  const ingredients = ["Chicken", "Beef", "Pork", "Fish", "Shrimp", "Mushroom", "Tofu", "Carrot", "Potato", "Onion"];

  // Show only the first 6 ingredients unless "Show More" is clicked
  const visibleIngredients = showAll ? ingredients : ingredients.slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Ingredients Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Filter by Ingredients</h3>
        <div className="max-h-full overflow-y-auto rounded-lg border border-gray-200 p-3 w-full">
          
          {/* Search Input */}
          <div className="relative max-w-lg mx-auto">
            <input
              type="text"
              placeholder="Search ingredients..."
              className="w-full px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300"
            />
          </div>

          {/* Display Ingredients */}
          <div className="flex flex-col space-y-2 mt-5 mb-3">
            {visibleIngredients.map((ingredient, index) => (
              <IngredientElement key={index} ingredient={ingredient} />
            ))}
          </div>

          {/* Show More Button (Only if there are more than 6 ingredients) */}
          {ingredients.length > 6 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-medium px-4 py-2 rounded-md shadow-sm transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-md active:scale-95"
            >
              <p className="text-xs uppercase tracking-wide">
                {showAll ? "Show Less" : "More Ingredients"}
              </p>
            </button>
          )}

        </div>
      </div>
    </div>
  );
};

export default IngredientSelection;
