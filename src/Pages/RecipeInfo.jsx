import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import NavBar from "../Components/NavBar";

const RecipeInfo = () => {
  const { RecipeId } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [recipeUser, setRecipeUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRecipeAndUser = async () => {
      setLoading(true);

      try {
        // Fetch recipe
        const recipeResponse = await fetch(`http://localhost:3000/recipe/${RecipeId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!recipeResponse.ok) throw new Error("Failed to fetch the recipe");
        const recipeData = await recipeResponse.json();
        setRecipe(recipeData);

        // Fetch recipe owner
        const userResponse = await fetch(`http://localhost:3000/user/getUserById`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: recipeData.recipe_user }),
        });

        if (!userResponse.ok) throw new Error("Failed to fetch the recipe owner");
        const userData = await userResponse.json();
        setRecipeUser(userData);
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeAndUser();
  }, [RecipeId]);

  if (loading) {
    return <div className="text-center text-gray-700 py-8">Loading...</div>;
  }

  if (!recipe) {
    return <div className="text-center text-gray-700 py-8">No recipe found.</div>;
  }

  // return (
  //   <div className="flex flex-col">
      
  //     <NavBar />
  //   <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-2xl mt-24">
  //     {/* Recipe Title */}
  //     <h1 className="text-4xl font-bold text-gray-900 text-center mb-6">
  //       {recipe.recipe_title}
  //     </h1>

  //     {/* Recipe Image */}
  //     <div className="flex justify-center">
  //       <img
  //         src={recipe.recipe_image}
  //         alt={recipe.recipe_title}
  //         className="w-full md:w-3/4 lg:w-2/3 h-72 object-cover rounded-xl shadow-md hover:scale-105 transition-transform duration-300"
  //       />
  //     </div>

  //     {/* Recipe Description */}
  //     <div className="mt-8">
  //       <p className="text-lg text-gray-700 text-center italic">
  //         {recipe.recipe_description}
  //       </p>
  //     </div>

  //     {/* Created By Section */}
  //     <div className="mt-6 text-center text-gray-600">
  //       <p>
  //         Created By: <span className="font-semibold text-indigo-600">{recipeUser?.username || "Unknown User"}</span>
  //       </p>
  //     </div>

  //     {/* Ingredients Section */}
  //     <div className="mt-8 p-6 bg-gray-50 rounded-lg">
  //       <h2 className="text-2xl font-semibold text-gray-800 mb-4">Ingredients</h2>
  //       <ul className="list-disc list-inside space-y-2 text-gray-700">
  //         {recipe.ingredients.map((ingredient, index) => (
  //           <li key={index} className="text-lg">
  //             <span className="font-medium text-gray-800">{ingredient.name}</span> - {ingredient.quantity}
  //           </li>
  //         ))}
  //       </ul>
  //     </div>

  //     {/* Instructions Section */}
  //     <div className="mt-8 p-6 bg-gray-50 rounded-lg">
  //       <h2 className="text-2xl font-semibold text-gray-800 mb-4">Instructions</h2>
  //       <ol className="list-decimal list-inside space-y-3 text-gray-700">
  //         {recipe.instructions.split(". ").map((step, index) => (
  //           step && (
  //             <li key={index} className="text-lg">
  //               {step.trim()}
  //             </li>
  //           )
  //         ))}
  //       </ol>
  //     </div>

  //     {/* Additional Details */}
  //     <div className="mt-8 text-center text-gray-600">
  //       <p>
  //         Type: <span className="font-semibold text-indigo-600">{recipe.type}</span>
  //       </p>
  //       <p>
  //         Created At: <span className="font-semibold text-indigo-600">{new Date(recipe.createdAt).toLocaleDateString()}</span>
  //       </p>
  //     </div>
  //   </div>
  //   </div>
  // );

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 mt-13">
      
      <NavBar />
      
      <div className="w-full p-6 bg-white shadow-lg rounded-2xl mt-8 mx-auto max-w-full md:max-w-5xl lg:max-w-7xl">
        {/* Recipe Title */}
        <h1 className="text-4xl font-bold text-gray-900 text-center mb-6">
          {recipe.recipe_title}
        </h1>
  
        {/* Recipe Image */}
        <div className="flex justify-center">
          <img
            src={recipe.recipe_image}
            alt={recipe.recipe_title}
            className="w-full md:w-3/4 lg:w-2/3 h-72 object-cover rounded-xl shadow-md hover:scale-105 transition-transform duration-300"
          />
        </div>
  
        {/* Recipe Description */}
        <div className="mt-8 px-4 md:px-6 lg:px-8">
          <p className="text-lg text-gray-700 text-center italic">
            {recipe.recipe_description}
          </p>
        </div>
  
        {/* Created By Section */}
        <div className="mt-6 text-center text-gray-600">
          <p>
            Created By: <span className="font-semibold text-indigo-600">{recipeUser?.username || "Unknown User"}</span>
          </p>
        </div>
  
        {/* Ingredients Section */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Ingredients</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="text-lg">
                <span className="font-medium text-gray-800">{ingredient.name}</span> - {ingredient.quantity}
              </li>
            ))}
          </ul>
        </div>
  
        {/* Instructions Section */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Instructions</h2>
          <ol className="list-decimal list-inside space-y-3 text-gray-700">
            {recipe.instructions.split(". ").map((step, index) => (
              step && (
                <li key={index} className="text-lg">
                  {step.trim()}
                </li>
              )
            ))}
          </ol>
        </div>
  
        {/* Additional Details */}
        <div className="mt-8 text-center text-gray-600">
          <p>
            Type: <span className="font-semibold text-indigo-600">{recipe.type}</span>
          </p>
          <p>
            Created At: <span className="font-semibold text-indigo-600">{new Date(recipe.createdAt).toLocaleDateString()}</span>
          </p>
        </div>
      </div>
    </div>
  );
  
};

export default RecipeInfo;