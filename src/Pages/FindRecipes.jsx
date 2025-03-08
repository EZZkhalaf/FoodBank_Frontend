import React, { useState, useEffect } from 'react';
import DisplayRecipes from '../Components/DisplayRecipes';
import IngredientSelection from '../Components/IngredientSelection';
import RecipeType from '../Components/RecipeType';
import NavBar from '../Components/NavBar';
import RecipeElement from '../Components/RecipeElement';

const FindRecipes = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);

  // Fetch all recipes when component mounts
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch('http://localhost:3000/recipe');
        const data = await response.json();
        setRecipes(data);
        setFilteredRecipes(data);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };

    fetchRecipes();
  }, []);

  // Filter recipes based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredRecipes(recipes);
      return;
    }

    const filtered = recipes.filter(recipe =>
      recipe.recipe_title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredRecipes(filtered);
  }, [searchQuery, recipes]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <NavBar />

      <div className="container mx-auto px-4 max-w-7xl py-10 mt-15">
        {/* Search Bar Section */}
        <div className="mb-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
            Find Recipes
          </h2>
          <div className="max-w-lg mx-auto relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search recipes..."
              className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
            />
          </div>
        </div>

        {/* Main Content - Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Filter Sidebar */}
          <div className="md:col-span-1 bg-white rounded-xl shadow-lg p-6 space-y-6 h-fit">
            <IngredientSelection />
            <RecipeType />
          </div>

          {/* Recipes Grid */}
          <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => (
              <RecipeElement
                key={recipe._id}
                RecipeId={recipe._id}
                recipe_image={recipe.recipe_image}
                recipe_name={recipe.recipe_title}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindRecipes;
