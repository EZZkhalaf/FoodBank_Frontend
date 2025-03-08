import React from 'react';

const RecipeType = () => {
  return (
    <div>
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Filter by Recipe Type</h3>
        <div className="max-h-64 overflow-y-auto rounded-lg border border-gray-200 p-3">
          {/* Static list of recipe types without functionality */}
          <div className="flex items-center mb-2">
            <input
              type="radio"
              name="recipeType"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
            />
            <label className="ml-2 text-sm text-gray-600">
              Appetizers
            </label>
          </div>
          <div className="flex items-center mb-2">
            <input
              type="radio"
              name="recipeType"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
            />
            <label className="ml-2 text-sm text-gray-600">
              Main Courses
            </label>
          </div>
          <div className="flex items-center mb-2">
            <input
              type="radio"
              name="recipeType"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
            />
            <label className="ml-2 text-sm text-gray-600">
              Desserts
            </label>
          </div>
          <div className="flex items-center mb-2">
            <input
              type="radio"
              name="recipeType"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
            />
            <label className="ml-2 text-sm text-gray-600">
              Soups
            </label>
          </div>
          <div className="flex items-center mb-2">
            <input
              type="radio"
              name="recipeType"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
            />
            <label className="ml-2 text-sm text-gray-600">
              Salads
            </label>
          </div>
          {/* Add more static recipe types as needed */}
        </div>
      </div>
    </div>
  );
};

export default RecipeType;