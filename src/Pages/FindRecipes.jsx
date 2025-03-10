import React, { useState, useEffect } from 'react';
import IngredientSelection from '../Components/IngredientSelection';
import RecipeType from '../Components/RecipeType';
import NavBar from '../Components/NavBar';
import RecipeElement from '../Components/RecipeElement';
import { ServerOff } from 'lucide-react';

const FindRecipes = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [ingredientsOpen , setIngredientsOpen] = useState(false);
  const [selectedItems , setSelectedItems] = useState([]); // this for the selected ingredients
  
  // Fetch all recipes when component mounts
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch('http://localhost:3000/recipe');
        const data = await response.json();
        setRecipes(data);
        setFilteredRecipes(data); // Initially set all recipes as filtered
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };

    fetchRecipes();
  }, []);

  // Filter recipes based on search query and selected ingredients
  useEffect(() => {
    const searchWithIngredients = async () => {
      try {
        const response = await fetch('http://localhost:3000/recipe/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ingredients: selectedItems.map(ing => ({ingredient_name : ing}))
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          console.log(data);
          return;
        }
        if (data.length === 0 || data.message === 'Please provide ingredients to search for.') {
          setFilteredRecipes([]);
        } else {
          setFilteredRecipes(data);
        }

        // Optional: If you want to handle search query as well
        if (searchQuery) {
          const filteredByQuery = data.filter(recipe =>
            recipe.recipe_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            recipe.recipe_description.toLowerCase().includes(searchQuery.toLowerCase())
          );
          setFilteredRecipes(filteredByQuery);
        }

      } catch (error) {
        console.error('Error fetching filtered recipes:', error);
      }
    };

    // If no ingredients selected, reset filtered recipes to show all recipes
    if (!selectedItems.length) {
      setFilteredRecipes(recipes);
    } else {
      searchWithIngredients();
    }
  }, [searchQuery, selectedItems, recipes]); // Trigger the API call when either searchQuery or selectedItems changes

  return (
    <div className="bg-gray-50 min-h-screen">
      <NavBar />

      <div className="container mx-auto px-4 max-w-7xl py-10 mt-15 w-full">
        {/* Search Bar Section */}
        <div className="mb-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
            Find Recipes
          </h2>

          <div className="flex w-full max-w-lg mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search recipes..."
              className="w-full px-5 py-3 border border-gray-300 rounded-l-lg shadow-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
            />
            {/* Trigger the ingredients filtering */}
            <button 
              onClick={() => setIngredientsOpen(!ingredientsOpen)}
              className="px-4 py-3 bg-indigo-500 text-white rounded-r-lg shadow-md hover:bg-indigo-600 transition">
              Filter with ingredients
            </button>
          </div>
        </div>

        {ingredientsOpen && (
          <div className='w-full'>
            <IngredientSelection 
              selectedItems={selectedItems}
              setSelectedItems={setSelectedItems}
            />
          </div>
        )}

        {/* Page Body */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Filtering */}
          <div className="md:col-span-1 bg-white rounded-xl shadow-lg p-6 space-y-6 h-fit">
            <RecipeType />
          </div>

          {/* Recipe Elements */}
          <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.length !== 0  ? (
              filteredRecipes.map((recipe) => (
                <RecipeElement
                  key={recipe._id}
                  RecipeId={recipe._id}
                  recipe_image={recipe.recipe_image}
                  recipe_name={recipe.recipe_title}
                />
              ))
            ) : (
              recipes.map((recipe) => (
                <RecipeElement
                  key={recipe._id}
                  RecipeId={recipe._id}
                  recipe_image={recipe.recipe_image}
                  recipe_name={recipe.recipe_title}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindRecipes;
