// import React, { useState, useEffect } from 'react';
// import IngredientSelection from '../Components/IngredientSelection';
// import RecipeType from '../Components/RecipeType';
// import NavBar from '../Components/NavBar';
// import RecipeElement from '../Components/RecipeElement';
// import { ServerOff } from 'lucide-react';
// import { debounce } from 'lodash';

// const FindRecipes = () => {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [recipes, setRecipes] = useState([]);
//   const [filteredRecipes, setFilteredRecipes] = useState([]);
//   const [ingredientsOpen , setIngredientsOpen] = useState(false);
//   const [selectedItems , setSelectedItems] = useState([]); // this for the selected ingredients
//   const [selectedRecipeType, setSelectedRecipeType] = useState('');



//   // Fetch all recipes when component mounts
//   useEffect(() => {
//     const fetchRecipes = async () => {
//       try {
//         const response = await fetch('http://localhost:3000/recipe');
//         const data = await response.json();
//         setRecipes(data);
//         setFilteredRecipes(data); // Initially set all recipes as filtered
//       } catch (error) {
//         console.error('Error fetching recipes:', error);
//       }
//     };

//     fetchRecipes();
//   }, []);

 
//   const debounceSearchRecipe = debounce( query => SearchRecipeByName(query)) 
//   useEffect(()=>{
//     debounceSearchRecipe(searchQuery)
//   }, [searchQuery]);



//     const SearchRecipeByName = async (searchedRecipe)=>{
//       try {
//         const response = await fetch('http://localhost:3000/recipe/searchRecipeByName',{
//           method:'POST' ,
//           headers : {"Content-Type" : 'application/json'},
//           body:JSON.stringify({
//             recipe_name : searchedRecipe
//           })
//         })
//         const data = await response.json();
//         if(!response.ok){ 
//           console.log(data.message)
//           return 
//         }
//         console.log(data)
//         setFilteredRecipes(data);
//       } catch (error) {
//         throw new Error(error) 
//       }
//     }
 

//   // Filter recipes based on search query and selected ingredients
//   useEffect(() => {
//     const searchWithIngredients = async () => {
//       try {
//         const response = await fetch('http://localhost:3000/recipe/search', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({
//             ingredients: selectedItems.map(ing => ({ingredient_name : ing}))
//           }),
//         });

//         const data = await response.json();
//         if (!response.ok) {
//           console.log(data);
//           return;
//         }
//         if (data.length === 0 || data.message === 'Please provide ingredients to search for.') {
//           setFilteredRecipes([]);
//         } else {
//           setFilteredRecipes(data);
//         }

//         // Optional: If you want to handle search query as well
//         if (searchQuery) {
//           const filteredByQuery = data.filter(recipe =>
//             recipe.recipe_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//             recipe.recipe_description.toLowerCase().includes(searchQuery.toLowerCase())
//           );
//           setFilteredRecipes(filteredByQuery);
//         }

//       } catch (error) {
//         console.error('Error fetching filtered recipes:', error);
//       }
//     };

//     // If no ingredients selected, reset filtered recipes to show all recipes
//     if (!selectedItems.length) {
//       setFilteredRecipes(recipes);
//     } else {
//       searchWithIngredients();
//     }
//   }, [searchQuery, selectedItems, recipes]); // Trigger the API call when either searchQuery or selectedItems changes

//   //for filtering the recipes using the types of the recipe
//   useEffect(()=>{
//     const handleRecipeType = ()=>{
//       if(!selectedRecipeType) {
//         return 
//       }
//       const filteredRecipeByType =  filteredRecipes.filter(recipe => recipe.type === selectedRecipeType)
//       setFilteredRecipes(filteredRecipeByType);
//     }
//     handleRecipeType();
//   },[selectedRecipeType])



//   return (
//     <div className="bg-gray-50 min-h-screen">
//       <NavBar />

//       <div className="container mx-auto px-4 max-w-7xl py-10 mt-15 w-full">
//         {/* Search Bar Section */}
//         <div className="mb-10 text-center">
//           <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
//             Find Recipes
//           </h2>

//           <div className="flex w-full max-w-lg mx-auto">
//             <input
//               type="text"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               placeholder="Search recipes..."
//               className="w-full px-5 py-3 border border-gray-300 rounded-l-lg shadow-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
//             />
//             {/* Trigger the ingredients filtering */}
//             <button 
//               onClick={() => setIngredientsOpen(!ingredientsOpen)}
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

//         {/* Page Body */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//           {/* Filtering */}
//           <div className="md:col-span-1 bg-white rounded-xl shadow-lg p-6 space-y-6 h-fit">
//             <RecipeType 
//               selectedRecipeType={selectedRecipeType} 
//               setSelectedRecipeType={setSelectedRecipeType}/>
//           </div>

//           {/* Recipe Elements */}
//           <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredRecipes.length !== 0  ? (
//               filteredRecipes.map((recipe) => (
//                 <RecipeElement
//                   key={recipe._id}
//                   RecipeId={recipe._id}
//                   recipe_image={recipe.recipe_image}
//                   recipe_name={recipe.recipe_title}
//                 />
//               ))
//             ) : (
//               recipes.map((recipe) => (
//                 <RecipeElement
//                   key={recipe._id}
//                   RecipeId={recipe._id}
//                   recipe_image={recipe.recipe_image}
//                   recipe_name={recipe.recipe_title}
//                 />
//               ))
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FindRecipes;





// to be added lter merging all filtering parts

import React, { useState, useEffect } from 'react';
import IngredientSelection from '../Components/IngredientSelection';
import RecipeType from '../Components/RecipeType';
import NavBar from '../Components/NavBar';
import RecipeElement from '../Components/RecipeElement';
import { ServerOff } from 'lucide-react';
import { debounce } from 'lodash';

const FindRecipes = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [ingredientsOpen , setIngredientsOpen] = useState(false);
  const [selectedItems , setSelectedItems] = useState([]); // this for the selected ingredients
  const [selectedRecipeType, setSelectedRecipeType] = useState('');



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

 
  const applyFilters = () => {
    let filtered = [...recipes];

    // Filter by search query (recipe name)
    if (searchQuery) {
      filtered = filtered.filter((recipe) =>
        recipe.recipe_title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by selected ingredients
    if (selectedItems.length > 0) {
      filtered = filtered.filter((recipe) =>
        selectedItems.every((ing) =>
          recipe.ingredients.some((recipeIng) => recipeIng.ingredient_name === ing)
        )
      );
    }

    // Filter by recipe type
    if (selectedRecipeType) {
      filtered = filtered.filter((recipe) => recipe.type === selectedRecipeType);
    }

    setFilteredRecipes(filtered);
  };

  const debounceFilter = debounce(applyFilters , 300);

  useEffect(() => {
      debounceFilter();
  }, [searchQuery, selectedItems, selectedRecipeType]);


  const clearFilters = () =>{
    setSearchQuery('');
    setSelectedItems([]);
    setSelectedRecipeType('');
    setFilteredRecipes(recipes); 
  }

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
              className="px-4 py-3 bg-indigo-500 text-white rounded-r-lg shadow-md hover:bg-indigo-600 transition"
            >
              Filter with ingredients
            </button>
          </div>
        </div>

        {ingredientsOpen && (
          <div className="w-full">
            <IngredientSelection
              selectedItems={selectedItems}
              setSelectedItems={setSelectedItems}
            />
          </div>
        )}

        {/* Clear Filters Button */}
        <div className="text-center mb-6">
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition"
          >
            Clear Filters
          </button>
        </div>

        {/* Page Body */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Filtering */}
          <div className="md:col-span-1 bg-white rounded-xl shadow-lg p-6 space-y-6 h-fit">
            <RecipeType
              selectedRecipeType={selectedRecipeType}
              setSelectedRecipeType={setSelectedRecipeType}
            />
          </div>

          {/* Recipe Elements */}
          <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.length > 0 ? (
              filteredRecipes.map((recipe) => (
                <RecipeElement
                  key={recipe._id}
                  RecipeId={recipe._id}
                  recipe_image={recipe.recipe_image}
                  recipe_name={recipe.recipe_title}
                />
              ))
            ) : (
              <p className="text-gray-600">No recipes found matching the filters.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindRecipes;





