import React, { useEffect, useState } from 'react';
import IngredientElement from './IngredientElement';

const IngredientSelection = () => {
  const [ingredientsBucket, setIngredientsBucket] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [query, setQuery] = useState('');
  const [searchedIngBucket, setSearchedIngBucket] = useState([]);
  const [loading, setLoading] = useState(false);

  const selected = 'bg-gray-500'; // Darker gray for selected ingredients
  const notSelected = 'bg-gray-200'; // Lighter gray for not selected (searched) ingredients

  useEffect(() => {
    const delay = setTimeout(() => handleIngredientSearch(query), 500);
    return () => clearTimeout(delay);
  }, [query]);

  const handleIngredientSearch = async (searchedIng) => {
    if (!searchedIng) {
      setSearchedIngBucket([]);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/ingredients/searchIngredient', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ingredient_name: searchedIng,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data || 'error fetching the searchIngredients section');

      setSearchedIngBucket(data);
    } catch (error) {
      console.log('error in fetching ingredients', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getFirst30 = async () => {
      try {
        const response = await fetch('http://localhost:3000/ingredients/getFirst20');
        if (!response.ok) throw new Error('error in fetching the data and the network');

        const data = await response.json();
        setIngredientsBucket(data);
      } catch (error) {
        throw new Error(error);
      }
    };
    getFirst30();
  }, []);

  // Show only the first 30 ingredients unless "Show All" is selected
  const visibleIngredients = showAll ? ingredientsBucket : ingredientsBucket.slice(0, 30);
  const visibleSearchedIngredients = searchedIngBucket.slice(0,30) 

  return (
    <div className="w-full h-1/2 min-h-[50vh] px-4 flex flex-col">
      {/* Ingredients Section */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 h-full flex flex-col">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Filter by Ingredients</h3>

        {/* Search Input */}
        <div className="relative w-full">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="Search ingredients..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
        </div>

        {/* Searched Ingredients */}
        {searchedIngBucket.length > 0 && (
          <>
            <div className="flex flex-wrap gap-4 p-4 min-w-[calc(40rem)] bg-gray-300 rounded-md shadow-md">
              {visibleSearchedIngredients.map((ingredient, index) => (
                <IngredientElement key={index} ingredient={ingredient.ingredient_name} bgColor={notSelected} />
              ))}
            </div>

            {/* Divider Line */}
            <hr className="border-t border-gray-400 my-4" />
          </>
        )}

        {/* Ingredients List (Selected) */}
        <div className="flex flex-wrap gap-4 p-4 min-w-[calc(40rem)] bg-gray-200 rounded-md shadow-md">
          {visibleIngredients.map((ingredient, index) => (
            <IngredientElement key={index} ingredient={ingredient.ingredient_name} bgColor={selected} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default IngredientSelection;
