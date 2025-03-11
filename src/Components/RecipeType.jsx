import React, { useState } from 'react';

const RecipeType = ({ selectedRecipeType, setSelectedRecipeType }) => {
  // Static list of recipe types
  const recipeTypes = [
    '',
    'Appetizer',
    'Main Course',
    'Dessert',
    'Soup',
    'Salad',
    'Beverage',
    'Side Dish',
    'Snack',
    'Drinks',
    'Vegan'
  ];

  // Handle the change in recipe type
  const handleChange = (type) => {
    setSelectedRecipeType(prevType => (prevType === type ? '' : type));
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Filter by Recipe Type</h3>
      <div className="max-h-64 overflow-hidden rounded-lg border border-gray-200 p-3">
        {/* Dynamically rendering recipe types */}
        {recipeTypes.map((type) => (
          <div className="flex items-center mb-2" key={type}>
            <input
              type="radio"
              name="recipeType"
              value={type}
              checked={selectedRecipeType === type}
              onChange={() => handleChange(type)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
            />
            <label className="ml-2 text-sm text-gray-600">{type}</label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipeType;


