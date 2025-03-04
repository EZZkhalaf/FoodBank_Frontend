import React, { useEffect, useState } from 'react';
import RecipeElement from './RecipeElement';

const DisplayRecipes = () => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await fetch('http://localhost:3000/recipe');
        const data = await res.json();
        setRecipes(data);
      } catch (err) {
        console.error('Error fetching recipes:', err);
      }
    };

    fetchRecipes();
  }, []);



  return (
    <div className='grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-4 gap-y-5'>
      {recipes.map((recipe) => (
        <RecipeElement
          key={recipe._id} // Add a unique key
          RecipeId={recipe._id}
          recipe_image={recipe.recipe_image}
          recipe_name={recipe.recipe_title}
        />
      ))}
    </div>
  );
};

export default DisplayRecipes;
