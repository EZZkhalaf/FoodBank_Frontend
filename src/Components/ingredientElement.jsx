import React from 'react';

const IngredientElement = ({ ingredient, bgColor }) => {
  return (
    <div className="flex items-center mb-2">
      <input
        type="checkbox"
        name="recipeType"
        className={`h-4 w-4 text-indigo-600 focus:ring-indigo-500 ${bgColor === 'selected' ? 'bg-gray-600' : 'bg-gray-300'}`}
      />
      <label className={`ml-2 text-sm ${bgColor === 'selected' ? 'text-black' : 'text-gray-600'}`}>
        {ingredient || 'Unknown Ingredient'}
      </label>
    </div>
  );
};

export default IngredientElement;
