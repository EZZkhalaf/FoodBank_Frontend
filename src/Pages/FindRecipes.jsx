

// import React, { useState, useEffect, useCallback } from 'react';
// import IngredientSelection from '../Components/IngredientSelection';
// import RecipeType from '../Components/RecipeType';
// import NavBar from '../Components/NavBar';
// import RecipeElement from '../Components/RecipeElement';
// import { ServerOff } from 'lucide-react';
// import { useSearchParams } from 'react-router-dom';
// const API_ENDPOINTS = {
//   RECIPES: 'http://localhost:3000/recipe',
//   SEARCH_BY_NAME: 'http://localhost:3000/recipe/searchRecipeByName',
//   SEARCH_BY_INGREDIENTS: 'http://localhost:3000/recipe/search',
// };
// const FindRecipes = () => {
//     const [searchQuery, setSearchQuery] = useState('');
//     const [recipes, setRecipes] = useState([]);
//     const [filteredRecipes, setFilteredRecipes] = useState([]);
//     const [ingredientsOpen, setIngredientsOpen] = useState(false);
//     const [selectedItems, setSelectedItems] = useState([]);
//     const [selectedRecipeType, setSelectedRecipeType] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const [searchParams] = useSearchParams();


//     useEffect(() => {
//       const initialCategory = searchParams.get('category');
//       if (initialCategory) setSelectedRecipeType(decodeURIComponent(initialCategory));
//     }, [searchParams]);



//       const fetchRecipes = useCallback(async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const response = await fetch(API_ENDPOINTS.RECIPES);
//         if (!response.ok) throw new Error('Failed to fetch recipes');
        
//         const data = await response.json();
//         setRecipes(data);
//         setFilteredRecipes(data);
//       } catch (error) {
//       setError(error.message);
//       } finally {
//       setLoading(false);
//       }
//     }, []);



//     useEffect(() => {
//       fetchRecipes();
//     }, [fetchRecipes]);


//     const applyFilters = useCallback(() => {
//         let filtered = [...recipes];

//         // Filter by name
//         if (searchQuery) {
//           filtered = filtered.filter(recipe =>
//             recipe.recipe_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//             recipe.recipe_description.toLowerCase().includes(searchQuery.toLowerCase())
//           );
//         }
//         // Filter by ingredients
//         if (selectedItems.length > 0) {
//           const ingredientNames = selectedItems.map(ing => ing.toLowerCase());
//           filtered = filtered.filter(recipe => {
//             const recipeIngredients = recipe.ingredients.map(ing => ing.ingredient_name.toLowerCase());
//             return ingredientNames.every(ing => recipeIngredients.includes(ing));
//           });
//         }

//         // Filter by type
//         if (selectedRecipeType) filtered = filtered.filter(recipe => recipe.type === selectedRecipeType);
        

//         setFilteredRecipes(filtered);

//     }, [recipes, searchQuery, selectedItems, selectedRecipeType]);


//     useEffect(() => {
//       applyFilters();
//     }, [applyFilters]);



//     const handleSearchQueryChange = useCallback((e) => {
//       setSearchQuery(e.target.value);
//     }, []);
//     const handleIngredientsToggle = useCallback(() => {
//       setIngredientsOpen(prev => !prev);
//     }, []);
//     const renderRecipes = (recipes) => (
//         recipes.map((recipe) => (
//           <RecipeElement 
//               key={recipe._id}
//               RecipeId={recipe._id}
//               recipe_image={recipe.recipe_image}
//               recipe_name={recipe.recipe_title}
//               recipe_description={recipe.recipe_description}
//               recipeType={recipe.type} 
//               cookingTime={recipe.cookingTime}
//               difficulty={recipe.difficullty}
//             />
//         ))
//     );
//     if (loading) return <div>Loading...</div>;

//     if (error) return <div>Error: {error}</div>;

//     return (
//         <div className="bg-gray-50 min-h-screen">
//         <NavBar />
//           <div className="container mx-auto px-4 max-w-7xl py-10 mt-15 w-full">
//             <div className="mb-10 text-center">
//               <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
//                 Find Recipes
//               </h2>

//               <div className="flex w-full max-w-lg mx-auto">
//                 <input
//                   type="text"
//                   value={searchQuery}
//                   onChange={handleSearchQueryChange}
//                   placeholder="Search recipes..."
//                   className="w-full px-5 py-3 border border-gray-300 rounded-l-lg shadow-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
//                 />
//                 <button
//                   onClick={handleIngredientsToggle}
//                   className="px-4 py-3 bg-indigo-500 text-white rounded-r-lg shadow-md hover:bg-indigo-600 transition">
//                   Filter with ingredients
//                 </button>
//               </div>
//             </div>

//             {ingredientsOpen && (
//               <div className='w-full'>
//                 <IngredientSelection
//                   selectedItems={selectedItems}
//                   setSelectedItems={setSelectedItems}
//                 />
//               </div>
//             )}

//             <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//               <div className="md:col-span-1 bg-white rounded-xl shadow-lg p-6 space-y-6 h-fit">
//                 <RecipeType
//                   selectedRecipeType={selectedRecipeType}
//                   setSelectedRecipeType={setSelectedRecipeType}
//                 />
//               </div>

//               <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {filteredRecipes.length !== 0 ? renderRecipes(filteredRecipes) : (
//                   <div className="text-center text-gray-500">
//                     <ServerOff size={48} />
//                     <p>No recipes found.</p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//     );
// };
// export default FindRecipes;

import React, { useState, useEffect, useCallback } from 'react';
import IngredientSelection from '../Components/IngredientSelection';
import RecipeType from '../Components/RecipeType';
import NavBar from '../Components/NavBar';
import RecipeElement from '../Components/RecipeElement';
import { ServerOff, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

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
    
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const recipesPerPage = 12;

    useEffect(() => {
      const initialCategory = searchParams.get('category');
      if (initialCategory) setSelectedRecipeType(decodeURIComponent(initialCategory));
    }, [searchParams]);

    const fetchRecipes = useCallback(async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(API_ENDPOINTS.RECIPES);
        if (!response.ok) throw new Error('Failed to fetch recipes');
        
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

    const applyFilters = useCallback(() => {
        let filtered = [...recipes];

        // Filter by name
        if (searchQuery) {
          filtered = filtered.filter(recipe =>
            recipe.recipe_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            recipe.recipe_description.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        // Filter by ingredients
        if (selectedItems.length > 0) {
          const ingredientNames = selectedItems.map(ing => ing.toLowerCase());
          filtered = filtered.filter(recipe => {
            const recipeIngredients = recipe.ingredients.map(ing => ing.ingredient_name.toLowerCase());
            return ingredientNames.every(ing => recipeIngredients.includes(ing));
          });
        }

        // Filter by type
        if (selectedRecipeType) filtered = filtered.filter(recipe => recipe.type === selectedRecipeType);
        
        setFilteredRecipes(filtered);
        // Reset to first page when filters change
        setCurrentPage(1);

    }, [recipes, searchQuery, selectedItems, selectedRecipeType]);

    useEffect(() => {
      applyFilters();
    }, [applyFilters]);

    const handleSearchQueryChange = useCallback((e) => {
      setSearchQuery(e.target.value);
    }, []);

    const handleIngredientsToggle = useCallback(() => {
      setIngredientsOpen(prev => !prev);
    }, []);

    // Get current recipes for the page
    const indexOfLastRecipe = currentPage * recipesPerPage;
    const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
    const currentRecipes = filteredRecipes.slice(indexOfFirstRecipe, indexOfLastRecipe);
    
    // Calculate total pages
    const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
    const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

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

    // Pagination component
    const Pagination = () => {
      if (totalPages <= 1) return null;
      
      // Display a limited number of page numbers
      const maxDisplayedPages = 5;
      let startPage = Math.max(1, currentPage - Math.floor(maxDisplayedPages / 2));
      let endPage = startPage + maxDisplayedPages - 1;
      
      if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - maxDisplayedPages + 1);
      }
      
      const pageNumbers = [];
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      return (
        <div className="flex justify-center items-center mt-8 space-x-2">
          <button 
            onClick={prevPage} 
            disabled={currentPage === 1}
            className={`p-2 rounded-md ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-indigo-600 hover:bg-indigo-100'}`}
          >
            <ChevronLeft size={20} />
          </button>
          
          {startPage > 1 && (
            <>
              <button 
                onClick={() => paginate(1)} 
                className={`px-3 py-1 rounded-md ${currentPage === 1 ? 'bg-indigo-600 text-white' : 'text-indigo-600 hover:bg-indigo-100'}`}
              >
                1
              </button>
              {startPage > 2 && <span className="px-2">...</span>}
            </>
          )}
          
          {pageNumbers.map(number => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`px-3 py-1 rounded-md ${currentPage === number ? 'bg-indigo-600 text-white' : 'text-indigo-600 hover:bg-indigo-100'}`}
            >
              {number}
            </button>
          ))}
          
          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <span className="px-2">...</span>}
              <button 
                onClick={() => paginate(totalPages)} 
                className={`px-3 py-1 rounded-md ${currentPage === totalPages ? 'bg-indigo-600 text-white' : 'text-indigo-600 hover:bg-indigo-100'}`}
              >
                {totalPages}
              </button>
            </>
          )}
          
          <button 
            onClick={nextPage} 
            disabled={currentPage === totalPages}
            className={`p-2 rounded-md ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-indigo-600 hover:bg-indigo-100'}`}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      );
    };

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
                {currentRecipes.length !== 0 ? renderRecipes(currentRecipes) : (
                  <div className="text-center text-gray-500 col-span-full flex flex-col items-center justify-center py-12">
                    <ServerOff size={48} />
                    <p>No recipes found.</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Pagination */}
            <Pagination />
            
            {/* Show results count */}
            <div className="text-center mt-4 text-gray-600">
              Showing {filteredRecipes.length > 0 ? indexOfFirstRecipe + 1 : 0}-
              {Math.min(indexOfLastRecipe, filteredRecipes.length)} of {filteredRecipes.length} recipes
            </div>
          </div>
        </div>
    );
};

export default FindRecipes;