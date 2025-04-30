
// import React, { useState, useEffect, useCallback } from 'react';
// import IngredientSelection from '../Components/IngredientSelection';
// import RecipeType from '../Components/RecipeType';
// import NavBar from '../Components/NavBar';
// import RecipeElement from '../Components/RecipeElement';
// import { ServerOff } from 'lucide-react';
// import { useSearchParams } from 'react-router-dom';

// const API_ENDPOINTS = {
//   RECIPES: 'http://localhost:3000/recipe/getRecipesPerPage',
//   SEARCH_BY_NAME: 'http://localhost:3000/recipe/searchRecipeByName',
//   SEARCH_BY_INGREDIENTS: 'http://localhost:3000/recipe/search',
// };

// const RECIPES_PER_PAGE = 12;

// const FindRecipes = () => {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [recipes, setRecipes] = useState([]);
//   const [filteredRecipes, setFilteredRecipes] = useState([]);
//   const [displayedRecipes, setDisplayedRecipes] = useState([]);
//   const [ingredientsOpen, setIngredientsOpen] = useState(false);
//   const [selectedItems, setSelectedItems] = useState([]);
//   const [selectedRecipeType, setSelectedRecipeType] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [searchParams] = useSearchParams();

//   useEffect(() => {
//     const initialCategory = searchParams.get('category');
//     if (initialCategory) setSelectedRecipeType(decodeURIComponent(initialCategory));
//   }, [searchParams]);






//   const fetchRecipes = useCallback(async () => {
//     setLoading(true);
//     const params = new URLSearchParams({
//       page: currentPage.toString(),
//       perPage: RECIPES_PER_PAGE.toString(),
//       searchQuery: searchQuery,
//       ingredients: JSON.stringify(selectedItems),
//       type: selectedRecipeType
//     });
  
//     try {
//       const response = await fetch(`http://localhost:3000/recipe/getRecipesPerPage?${params}` );
//       if (!response.ok) throw new Error('Network error');
//       console.log('testing')
      
//       const data = await response.json();
//       setRecipes(data.recipes);
//       setTotalPages(data.totalPages);
//     } catch (error) {
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   }, [currentPage, searchQuery, selectedItems, selectedRecipeType]);
  
//   // Update useEffect dependencies
//   useEffect(() => {
//     fetchRecipes();
//   }, [fetchRecipes]); 




//   const applyFilters = useCallback(() => {
//     let filtered = [...recipes];
  
//     // Filter by name
//     if (searchQuery) {
//       filtered = filtered.filter(recipe =>
//         recipe.recipe_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         recipe.recipe_description.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }
  
//     // Filter by ingredients
//     if (selectedItems.length > 0) {
//       const ingredientNames = selectedItems
//         .filter(ing => typeof ing === 'string')
//         .map(ing => ing.toLowerCase());

//       filtered = filtered.filter(recipe => {
//         if (!recipe.ingredients || !Array.isArray(recipe.ingredients)) return false;
        
//         const recipeIngredients = recipe.ingredients
//           .filter(ing => ing && typeof ing.name === 'string')
//           .map(ing => ing.name.toLowerCase());
        
//         return ingredientNames.every(ing => recipeIngredients.includes(ing));
//       });
//     }
  
//     // Filter by type
//     if (selectedRecipeType) {
//       filtered = filtered.filter(recipe => recipe.type === selectedRecipeType);
//     }

//     setFilteredRecipes(filtered);
//     setCurrentPage(1); // Reset to first page when filters change
//   }, [recipes, searchQuery, selectedItems, selectedRecipeType]);

//   useEffect(() => {
//     applyFilters();
//   }, [applyFilters]);

//   // Update displayed recipes and pagination when filteredRecipes changes
//   useEffect(() => {
//     const startIndex = (currentPage - 1) * RECIPES_PER_PAGE;
//     const endIndex = startIndex + RECIPES_PER_PAGE;
//     setDisplayedRecipes(filteredRecipes.slice(startIndex, endIndex));
//     setTotalPages(Math.ceil(filteredRecipes.length / RECIPES_PER_PAGE));
//   }, [filteredRecipes, currentPage]);

//   const handleSearchQueryChange = useCallback((e) => {
//     setSearchQuery(e.target.value);
//   }, []);

//   const handleIngredientsToggle = useCallback(() => {
//     setIngredientsOpen(prev => !prev);
//   }, []);

//   const handlePageChange = (newPage) => {
//     if (newPage >= 1 && newPage <= totalPages) {
//       setCurrentPage(newPage);
//       window.scrollTo({ top: 0, behavior: 'smooth' });
//     }
//   };

//   const renderRecipes = (recipes) => (
//     recipes.map((recipe) => (
//       <RecipeElement 
//         key={recipe._id}
//         RecipeId={recipe._id}
//         recipe_image={recipe.recipe_image}
//         recipe_name={recipe.recipe_title}
//         recipe_description={recipe.recipe_description}
//         recipeType={recipe.type} 
//         cookingTime={recipe.cookingTime}
//         difficulty={recipe.difficullty}
//       />
//     ))
//   );

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error}</div>;

//   return (
//     <div className="bg-gray-50 min-h-screen">
//       <NavBar />
//       <div className="container mx-auto px-4 max-w-7xl py-10 mt-15 w-full">
//         <div className="mb-10 text-center">
//           <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
//             Find Recipes
//           </h2>

//           <div className="flex w-full max-w-lg mx-auto">
//             <input
//               type="text"
//               value={searchQuery}
//               onChange={handleSearchQueryChange}
//               placeholder="Search recipes..."
//               className="w-full px-5 py-3 border border-gray-300 rounded-l-lg shadow-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
//             />
//             <button
//               onClick={handleIngredientsToggle}
//               className="px-4 py-3 bg-indigo-500 text-white rounded-r-lg shadow-md hover:bg-indigo-600 transition">
//               Filter with ingredients
//             </button>
//           </div>
//         </div>

//         {ingredientsOpen && (
//           <div className='w-full'>
//             <IngredientSelection
//               selectedItems={selectedItems}
//               setSelectedItems={setSelectedItems}
//             />
//           </div>
//         )}

//         <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//           <div className="md:col-span-1 bg-white rounded-xl shadow-lg p-6 space-y-6 h-fit">
//             <RecipeType
//               selectedRecipeType={selectedRecipeType}
//               setSelectedRecipeType={setSelectedRecipeType}
//             />
//           </div>

//           <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {displayedRecipes.length > 0 ? renderRecipes(displayedRecipes) : (
//               <div className="text-center text-gray-500 col-span-full">
//                 <ServerOff size={48} />
//                 <p>No recipes found.</p>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Pagination Controls */}
//         {totalPages > 1 && (
//           <div className="mt-10 flex justify-center">
//             <nav className="flex items-center gap-1">
//               <button
//                 onClick={() => handlePageChange(currentPage - 1)}
//                 disabled={currentPage === 1}
//                 className="px-3 py-1 rounded border disabled:opacity-50"
//               >
//                 Previous
//               </button>
              
//               {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
//                 <button
//                   key={page}
//                   onClick={() => handlePageChange(page)}
//                   className={`px-3 py-1 rounded border ${currentPage === page ? 'bg-indigo-500 text-white' : ''}`}
//                 >
//                   {page}
//                 </button>
//               ))}
              
//               <button
//                 onClick={() => handlePageChange(currentPage + 1)}
//                 disabled={currentPage === totalPages}
//                 className="px-3 py-1 rounded border disabled:opacity-50"
//               >
//                 Next
//               </button>
//             </nav>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default FindRecipes;


import React, { useState, useEffect, useCallback } from 'react';
import IngredientSelection from '../Components/IngredientSelection';
import RecipeType from '../Components/RecipeType';
import NavBar from '../Components/NavBar';
import RecipeElement from '../Components/RecipeElement';
import { ServerOff } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

const API_ENDPOINTS = {
  RECIPES: 'http://localhost:3000/recipe/getRecipesPerPage',
  SEARCH_BY_NAME: 'http://localhost:3000/recipe/searchRecipeByName',
  SEARCH_BY_INGREDIENTS: 'http://localhost:3000/recipe/search',
};

const RECIPES_PER_PAGE = 12;

const FindRecipes = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [displayedRecipes, setDisplayedRecipes] = useState([]);
  const [ingredientsOpen, setIngredientsOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedRecipeType, setSelectedRecipeType] = useState(''); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchParams] = useSearchParams();
  const componentTitle = 'filter by ingredients : '

  useEffect(() => {
    const initialCategory = searchParams.get('category');
    if (initialCategory) setSelectedRecipeType(decodeURIComponent(initialCategory));
  }, [searchParams]);

  const fetchRecipes = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: currentPage.toString(),
      perPage: RECIPES_PER_PAGE.toString(),
      searchQuery: searchQuery,
      ingredients: JSON.stringify(selectedItems),
      type: selectedRecipeType
    });

    try {
      const response = await fetch(`http://localhost:3000/recipe/getRecipesPerPage?${params}`);
      if (!response.ok) throw new Error('Network error');
      
      const data = await response.json();
      setRecipes(data.recipes);
      setTotalPages(data.totalPages);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, selectedItems, selectedRecipeType]);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderRecipes = (recipes) => (
    recipes.map((recipe) => (
      <RecipeElement 
        key={recipe._id}
        RecipeId={recipe._id}
        recipe_image={recipe.recipe_image}
        recipe_name={recipe.recipe_title}
        recipe_description={recipe.recipe_description}
        recipeType={recipe.type} 
        cookingTime={recipe.cookingTime}
        difficulty={recipe.difficullty}
      />
    ))
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

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
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search recipes..."
              className="w-full px-5 py-3 border border-gray-300 rounded-l-lg shadow-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
            />
            <button
              onClick={() => setIngredientsOpen(prev => !prev)}
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
              componentTitle={componentTitle}
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
            {recipes.length > 0 ? renderRecipes(recipes) : (
              <div className="text-center text-gray-500 col-span-full">
                <ServerOff size={48} />
                <p>No recipes found.</p>
              </div>
            )}
          </div>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-10 flex justify-center">
            <nav className="flex items-center gap-1">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded border disabled:opacity-50"
              >
                Previous
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 rounded border ${currentPage === page ? 'bg-indigo-500 text-white' : ''}`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded border disabled:opacity-50"
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default FindRecipes;