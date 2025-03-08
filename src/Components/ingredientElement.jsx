import React from 'react';

const IngredientElement = () => {
  return (
    <div className="flex items-center mb-2">
            <input
              type="checkbox"
              name="recipeType"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
            />
            <label className="ml-2 text-sm text-gray-600">
              ingredient
            </label>
    </div>
  );
};

export default IngredientElement;