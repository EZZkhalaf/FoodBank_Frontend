import React, { useState, useEffect, useCallback } from 'react';
import IngredientSelection from '../Components/IngredientSelection';
import RecipeType from '../Components/RecipeType';
import NavBar from '../Components/NavBar';
import RecipeElement from '../Components/RecipeElement';
import { ServerOff } from 'lucide-react';
import { debounce } from 'lodash';
import {useSearchParams} from 'react-router-dom';



const API_ENDPOINTS = {
  RECIPES: 'http://localhost:3000/recipe',
  SEARCH_BY_NAME: 'http://localhost:3000/recipe/searchRecipeByName',
  SEARCH_BY_INGREDIENTS: 'http://localhost:3000/recipe/search',
};

const FindRecipes = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [ingredientsOpen, setIngredientsOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedRecipeType, setSelectedRecipeType] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();

  useEffect(()=>{
    const initialCategory = searchParams.get('category');
    if(initialCategory) setSelectedRecipeType(decodeURIComponent(initialCategory));
    
  },[searchParams])

  const fetchRecipes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_ENDPOINTS.RECIPES);
      if (!response.ok) {
        throw new Error('Failed to fetch recipes');
      }
      const data = await response.json();
      setRecipes(data);
      setFilteredRecipes(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  const debounceSearchRecipe = useCallback(debounce(query => SearchRecipeByName(query), 300), []);

  useEffect(() => {
    debounceSearchRecipe(searchQuery);
  }, [searchQuery, debounceSearchRecipe]);

  const SearchRecipeByName = async (searchedRecipe) => {
    try {
      const response = await fetch(API_ENDPOINTS.SEARCH_BY_NAME, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipe_name: searchedRecipe
        })
      });
      const data = await response.json();
      if (!response.ok) {
        console.log(data.message);
        return;
      }
      setFilteredRecipes(data);
    } catch (error) {
      throw new Error(error);
    }
  };

  useEffect(() => {
    const searchWithIngredients = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.SEARCH_BY_INGREDIENTS, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ingredients: selectedItems.map(ing => ({ ingredient_name: ing }))
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

    if (!selectedItems.length) {
      setFilteredRecipes(recipes);
    } else {
      searchWithIngredients();
    }
  }, [searchQuery, selectedItems, recipes]);

  useEffect(() => {
    if (!selectedRecipeType) {
      setFilteredRecipes(recipes);
    } else {
      const filteredRecipeByType = recipes.filter(recipe => recipe.type === selectedRecipeType);
      setFilteredRecipes(filteredRecipeByType);
    }
  }, [selectedRecipeType, recipes]);

  const handleSearchQueryChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleIngredientsToggle = useCallback(() => {
    setIngredientsOpen(prev => !prev);
  }, []);

  const renderRecipes = (recipes) => (
    recipes.map((recipe) => (
      <RecipeElement 
      key={recipe._id}
      RecipeId={recipe._id}
      recipe_image={recipe.recipe_image}
      recipe_name={recipe.recipe_title}
      recipe_description={recipe.recipe_description}
      recipeType={recipe.type} 
      cookingTime ={recipe.cookingTime}
      difficulty = {recipe.difficullty}
    />
    ))
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <NavBar />

      <div className="container mx-auto px-4 max-w-7xl py-10 mt-15 w-full">
        <div className="mb-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
            Find Recipes
          </h2>

          <div className="flex w-full max-w-lg mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchQueryChange}
              placeholder="Search recipes..."
              className="w-full px-5 py-3 border border-gray-300 rounded-l-lg shadow-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
            />
            <button
              onClick={handleIngredientsToggle}
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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1 bg-white rounded-xl shadow-lg p-6 space-y-6 h-fit">
            <RecipeType
              selectedRecipeType={selectedRecipeType}
              setSelectedRecipeType={setSelectedRecipeType}
            />
          </div>

          <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.length !== 0 ? renderRecipes(filteredRecipes) : (
              <div className="text-center text-gray-500">
                <ServerOff size={48} />
                <p>No recipes found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindRecipes;