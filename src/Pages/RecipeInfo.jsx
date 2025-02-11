import React from 'react';

const RecipeInfo = () => {
  const recipe = {
    title: "Chocolate Chip Cookies",
    image: "https://images.unsplash.com/photo-1598373182131-1a0a6f3c3875",
    ingredients: [
      "1 cup butter, softened",
      "1 cup white sugar",
      "1 cup brown sugar",
      "2 eggs",
      "1 tsp vanilla extract",
      "3 cups all-purpose flour",
      "1 tsp baking soda",
      "1/2 tsp salt",
      "2 cups chocolate chips"
    ],
    instructions: [
      "Preheat oven to 350°F (175°C).",
      "In a bowl, cream together butter, white sugar, and brown sugar.",
      "Beat in eggs one at a time, then stir in vanilla.",
      "Combine flour, baking soda, and salt; gradually add to wet ingredients.",
      "Stir in chocolate chips.",
      "Drop by spoonfuls onto baking sheet and bake for 10-12 minutes.",
      "Let cool and enjoy!"
    ]
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h1 className="text-3xl font-bold text-gray-800">{recipe.title}</h1>
      <img src={recipe.image} alt={recipe.title} className="w-full h-64 object-cover rounded-lg mt-4" />

      <h2 className="text-xl font-semibold text-gray-700 mt-6">Ingredients:</h2>
      <ul className="list-disc list-inside mt-2 text-gray-600">
        {recipe.ingredients.map((ingredient, index) => (
          <li key={index}>{ingredient}</li>
        ))}
      </ul>

      <h2 className="text-xl font-semibold text-gray-700 mt-6">Instructions:</h2>
      <ol className="list-decimal list-inside mt-2 text-gray-600 space-y-2">
        {recipe.instructions.map((step, index) => (
          <li key={index}>{step}</li>
        ))}
      </ol>
    </div>
  );
};

export default RecipeInfo;
