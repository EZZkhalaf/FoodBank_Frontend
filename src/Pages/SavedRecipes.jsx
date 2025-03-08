
import React, { useState, useEffect } from 'react';
import SavedRecipeElement from '../Components/SavedRecipeElement';
import { useAuthContext } from '../Context/AuthContext';

const SavedRecipes = () => {
  const { user } = useAuthContext();
  const [recipes, setRecipes] = useState([]);
  const userid = user._id;

  // Fetch saved recipes
  useEffect(() => {
    const getSavedRecipes = async () => {
      try {
        const SavedRecipes = user.savedRecipes;
        setRecipes(SavedRecipes); 
      } catch (error) {
        console.log(error); // Handle error
      }
    };
    getSavedRecipes();
  }, [user]);

  // Remove a recipe from the saved list
  const removeRecipe = (RecipeId) => {
    setRecipes((prevRecipes) => prevRecipes.filter((recipe) => recipe._id !== RecipeId));
  };

  return (
    <div className="bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Saved Recipes</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-8">
        {recipes.map((recipe) => (
          <SavedRecipeElement
            key={recipe._id}
            RecipeId={recipe._id}
            recipe_image={recipe.recipe_image}
            recipe_name={recipe.recipe_title}
            removeRecipe={removeRecipe} // Pass removeRecipe function to child
          />
        ))}
      </div>
    </div>
  );
};

export default SavedRecipes;

