
import React, { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import NavBar from "../Components/NavBar";
import { IoMdBookmark } from "react-icons/io";
import defaultRecipeImage from '../assets/defaultRecipeImage.jpg';
import { Clock } from 'lucide-react';
import { HiMiniPencilSquare } from "react-icons/hi2";
import BookmarkButton from "../Components/BookMarkButton";
import Footer from "../Components/Footer";
import { useAuthContext } from "../Context/AuthContext";
import { RiCloseLargeLine } from "react-icons/ri";

const RecipeInfo = () => {
  const { RecipeId } = useParams();
  const { user } = useAuthContext();

  const [recipe, setRecipe] = useState(null);
  const [recipeUser, setRecipeUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // State for edited values
  const [newRecipeTitle, setNewRecipeTitle] = useState('');
  const [newIngredients, setNewIngredients] = useState([]);
  const [newInstruction, setNewInstruction] = useState('');
  const [newRecipeDescription, setNewRecipeDescription] = useState('');
  const [newCookingTime, setNewCookingTime] = useState(20);

  // New state for ingredient search
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestedIngredients, setSuggestedIngredients] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const fileInputRef = useRef(null);

  // Initialize edited values when recipe data is available
  useEffect(() => {
    if (recipe) {
      setNewRecipeTitle(recipe.recipe_title || '');
      setNewIngredients(recipe.ingredients || []);
      setNewInstruction(recipe.instructions || '');
      setNewRecipeDescription(recipe.recipe_description || '');
      setNewCookingTime(recipe.cookingTime || 20);
    }
  }, [recipe]);

  // Check if recipe is bookmarked
  useEffect(() => {
    const checkBookmark = async () => {
      const response = await fetch('http://localhost:3000/user/checkSave', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipeId: RecipeId,
          userId: user._id
        })
      });

      if (!response.ok) throw new Error('Request failed');
      const data = await response.json();
      setIsBookmarked(data === 'saved');
    };
    checkBookmark();
  }, [recipe]);

  // Fetch recipe and user data
  useEffect(() => {
    const fetchRecipeAndUser = async () => {
      setLoading(true);

      try {
        const recipeResponse = await fetch(`http://localhost:3000/recipe/${RecipeId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!recipeResponse.ok) throw new Error("Failed to fetch the recipe");
        const recipeData = await recipeResponse.json();
        setRecipe(recipeData);

        const userResponse = await fetch('http://localhost:3000/user/getUserById', {
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

  // Check if user is the recipe owner
  const [recipeOwner] = recipe?.recipe_user || [];
  const isRecipeOwner = user && recipe && user._id === recipeOwner;

  const [newRecipeImage, setNewRecipeImage] = useState(defaultRecipeImage);
  console.log(recipe);
  // Save edited recipe
  const saveEditedRecipe = async () => {
    try {



      let formData = new FormData();
      formData.append('newRecipe_title', newRecipeTitle);
      formData.append('newIngredients', JSON.stringify(newIngredients));
      formData.append('newInstructions', newInstruction);
      formData.append('newRecipe_description', newRecipeDescription);
      formData.append('newCookingTime', newCookingTime);
      formData.append('newRecipe_image', newRecipeImage); // File object

      console.log(newRecipeImage);

      const response = await fetch(`http://localhost:3000/recipe/${RecipeId}`, {method: 'post', body: formData});

      // if (!response.ok) throw new Error('Failed to update recipe');
      const updatedRecipe = await response.json();
      setRecipe(updatedRecipe);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving recipe:', error);
    }
  };

  // Cancel editing
  const cancelEditing = () => {
    setIsEditing(false);
    // Reset to original values
    if (recipe) {
      setNewRecipeTitle(recipe.recipe_title || '');
      setNewIngredients(recipe.ingredients || []);
      setNewInstruction(recipe.instructions || '');
      setNewRecipeDescription(recipe.recipe_description || '');
      setNewCookingTime(recipe.cookingTime || 20);
    }
  };

  const handleRecipeImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // If Base64 is needed
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewRecipeImage(reader.result);
    };
    reader.readAsDataURL(file);

    // If a file object is needed
    setNewRecipeImage(file);
  };

  if (loading) return <div className="text-center text-gray-700 py-8">Loading...</div>;
  if (!recipe) return <div className="text-center text-gray-700 py-8">No recipe found.</div>;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100">
      <NavBar className="sticky top-0 bg-white/90 backdrop-blur-md shadow-sm z-50" />
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 xs:px-6 sm:px-8 lg:px-10 py-6 sm:py-8 lg:py-12">
          <div className="relative bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-lg sm:shadow-xl lg:shadow-2xl overflow-hidden ring-1 sm:ring-2 ring-purple-200">
            {/* Recipe Header */}
            <div className="relative">
              {isEditing ? (
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleRecipeImageChange}
                    ref={fileInputRef}
                    className="hidden"
                  />
                  <img
                    src={newRecipeImage}
                    alt={recipe.recipe_title || "Default Recipe Image"}
                    className="w-full h-48 xs:h-64 sm:h-80 md:h-96 object-cover rounded-lg shadow-md"
                    onClick={() => fileInputRef.current.click()}
                    onError={(e) => {
                      e.target.src = defaultRecipeImage;
                      e.target.alt = "Default Recipe Image";
                    }}
                  />
                </div>
              ) : (
                <img
                  src={recipe.recipe_image || defaultRecipeImage}
                  alt={recipe.recipe_title || "Default Recipe Image"}
                  className="w-full h-48 xs:h-64 sm:h-80 md:h-96 object-cover"
                  onError={(e) => {
                    e.target.src = defaultRecipeImage;
                    e.target.alt = "Default Recipe Image";
                  }}
                />
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              
              <div className="absolute inset-0 p-4 sm:p-6 md:p-8 flex flex-col justify-end">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-4 drop-shadow-md">
                  {isEditing ? (
                    <input
                      type="text"
                      value={newRecipeTitle}
                      onChange={(e) => setNewRecipeTitle(e.target.value)}
                      className="w-full bg-transparent text-xl sm:text-2xl md:text-4xl font-bold text-white outline-none"
                    />
                  ) : (
                    recipe.recipe_title
                  )}
                </h1>
                
                <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-wrap">
                  {/* Buttons responsive adjustments */}
                  {isRecipeOwner && !isEditing ? (
                    <button
                      className="flex items-center px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-full shadow-lg hover:from-purple-600 hover:to-blue-700 transition-all"
                      onClick={() => setIsEditing(true)}
                    >
                      <HiMiniPencilSquare className="mr-1 sm:mr-2 w-4 h-4" />
                      Edit Recipe
                    </button>
                  ) : isRecipeOwner && isEditing ? (
                    <div className="flex gap-2 sm:gap-3">
                      <button
                        className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-full shadow-lg"
                        onClick={saveEditedRecipe}
                      >
                        Save
                      </button>
                      <button
                        className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base bg-gray-500 text-white rounded-full shadow-lg"
                        onClick={cancelEditing}
                      >
                        Cancel
                      </button>
                      <button
                        className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base bg-blue-500 text-white rounded-full shadow-lg"
                        onClick={() => fileInputRef.current.click()}
                      >
                        Choose Image
                      </button>
                    </div>
                  ) : (
                    <BookmarkButton
                      recipeId={RecipeId}
                      userId={user._id}
                      isBookmarked={isBookmarked}
                    />
                  )}
                  
                  <span className="text-white bg-gray-800/90 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                    {recipe.Bookmarks?.length || 0} bookmarks
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Recipe Details Grid */}
          <div className="p-4 sm:p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            {/* Left Column */}
            <div>
              {/* Created By Section Responsive Adjustments */}
              <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-6 mb-6">
                <Link
                  to={`/userPage/${recipe.recipe_user}`}
                  className="flex flex-col xs:flex-row items-start xs:items-center gap-4 sm:gap-6"
                >
                  <div className="relative -mt-12 xs:-mt-0">
                    <div className="w-20 sm:w-24 h-20 sm:h-24 rounded-2xl rotate-45 overflow-hidden border-4 border-white shadow-lg">
                      <img 
                        src={recipeUser?.avatar || defaultRecipeImage} 
                        alt="User avatar"
                        className="w-full h-full object-cover -rotate-45 scale-125"
                      />
                    </div>
                    {/* Verification badge sizing */}
                    {recipeUser?.verified && (
                      <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-0.5 sm:p-1 shadow-sm">
                        <div className="bg-emerald-500 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center">
                          <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zM10 13.25a3.25 3.25 0 100-6.5 3.25 3.25 0 000 6.5z"/>
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
                        {recipeUser?.username || "Unknown Chef"}
                      </h3>
                      <p className="text-xs sm:text-sm font-medium text-emerald-600">
                        Recipe Creator • {recipeUser?.experience || "Professional Chef"}
                      </p>
                    </div>
                    
                    <div className="inline-flex items-center bg-white rounded-full py-1 px-3 sm:py-1.5 sm:px-4 shadow-sm border border-gray-200">
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                      </svg>
                      <time 
                        dateTime={recipe.createdAt} 
                        className="text-xs sm:text-sm font-medium text-gray-600"
                      >
                        {new Date(recipe.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </time>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Cooking Time */}
              <div className="relative group bg-gradient-to-br from-purple-500 to-pink-500 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center space-x-4">
                  {/* Animated Clock Icon */}
                  <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                    <Clock 
                      className="w-8 h-8 text-white animate-pulse-slow"
                      strokeWidth={2.5}
                    />
                  </div>

                  {/* Text Content */}
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-purple-100 uppercase tracking-wide">
                      Cooking Time
                    </p>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-3xl font-bold text-white drop-shadow">
                        {isEditing ? (
                          <input
                            type="number"
                            value={newCookingTime}
                            onChange={(e) => setNewCookingTime(e.target.value)}
                            className="w-12 bg-transparent text-3xl font-bold text-white outline-none"
                          />
                        ) : (
                          recipe.cookingTime || 20
                        )}
                      </span>
                      <span className="text-lg font-medium text-purple-100">mins</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl">
              {/* Ingredients Section Responsive Adjustments */}
              <div className="mb-6 sm:mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Ingredients</h3>
                
                {isEditing ? (
                  <div className="space-y-3 sm:space-y-4">
                    <div className="relative">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search ingredients..."
                        className="w-full p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl shadow-sm text-sm sm:text-base"
                      />
                    </div>

                    {/* Suggested Ingredients Scroll Container */}
                    {suggestedIngredients.length > 0 && (
                      <div className="max-h-[150px] sm:max-h-[200px] overflow-y-auto bg-white rounded-lg sm:rounded-xl border border-gray-200">
                        {suggestedIngredients.map((ingredient) => (
                          <div
                            key={ingredient._id}
                            className="p-3 sm:p-4 hover:bg-gray-50 cursor-pointer text-sm sm:text-base"
                            onClick={() => addIngredient(ingredient)}
                          >
                            <div className="font-medium">{ingredient.name}</div>
                            <div className="text-gray-500 text-xs sm:text-sm">
                              {ingredient.description || 'No description'}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Added Ingredients List */}
                    {newIngredients.length > 0 ? (
                      <div className="mt-3 sm:mt-4">
                        <h4 className="text-base font-semibold mb-2">Added Ingredients</h4>
                        <div className="max-h-[150px] sm:max-h-[200px] overflow-y-auto space-y-2">
                          {newIngredients.map((ingredient, index) => (
                            <div key={index} className="flex items-center justify-between p-2 sm:p-3 bg-white rounded-lg shadow-sm">
                              <div className="flex flex-col w-full">
                                <h3 className="font-medium text-gray-800 text-sm sm:text-base">{ingredient.name}</h3>
                                <input
                                  type="text"
                                  value={ingredient.quantity || ''}
                                  onChange={(e) => {
                                    const updatedIngredients = [...newIngredients];
                                    updatedIngredients[index].quantity = e.target.value;
                                    setNewIngredients(updatedIngredients);
                                  }}
                                  className="bg-transparent border-none outline-none text-xs sm:text-sm"
                                />
                              </div>
                              <button
                                onClick={() => removeIngredient(index)}
                                className="text-red-500 hover:text-red-700 ml-2"
                              >
                                <RiCloseLargeLine className="w-4 h-4 sm:w-5 sm:h-5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl shadow-sm text-gray-500 text-sm sm:text-base">
                        No ingredients added yet.
                      </div>
                    )}
                  </div>
                ) : (
                  <ul className="max-h-[250px] sm:max-h-[300px] overflow-auto scrollbar-thin scrollbar-thumb-purple-200 scrollbar-track-purple-50 space-y-2">
                    {recipe.ingredients?.map((ingredient, index) => (
                      <li
                        key={index}
                        className="flex justify-between p-2 sm:p-3 bg-white rounded-lg shadow-sm text-sm sm:text-base"
                      >
                        <div>
                          <span className="font-medium text-gray-800">{ingredient.name}</span>
                          <span className="text-gray-500 ml-2">{ingredient.quantity}</span>
                        </div>
                        <span className="text-gray-400">{index + 1}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Instructions Section Responsive Adjustments */}
          <div className="p-4 sm:p-6 md:p-8 bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl ring-1 sm:ring-2 ring-purple-200 mt-6 sm:mt-8 md:mt-10">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 border-b-2 border-purple-300 pb-2">
              Step-by-Step Instructions
            </h2>
            {isEditing ? (
              <textarea
                value={newInstruction}
                onChange={(e) => setNewInstruction(e.target.value)}
                className="w-full p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl shadow-sm resize-none h-48 sm:h-64 text-sm sm:text-base"
                placeholder="Instructions..."
              />
            ) : (
              <ol className="space-y-3 sm:space-y-4">
                {recipe.instructions?.split(". ").map((step, index) =>
                  step ? (
                    <li key={index} className="relative pl-5 sm:pl-6 py-2 sm:py-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                      <span className="absolute left-1.5 sm:left-2 top-3.5 sm:top-4 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
                      <p className="text-gray-700 text-sm sm:text-base pl-3 sm:pl-4">{step.trim()}</p>
                    </li>
                  ) : null
                )}
              </ol>
            )}
          </div>
        </div>
      </main>

      <Footer className="bg-white/90 backdrop-blur-md shadow-inner" />
    </div>
  );
};

export default RecipeInfo;

// // pages/RecipeInfo.js
// import React, { useRef } from "react";
// import { useParams } from "react-router-dom";
// import NavBar from "../Components/NavBar";
// import defaultRecipeImage from '../assets/defaultRecipeImage.jpg';
// import Footer from "../Components/Footer";
// import { useAuthContext } from "../Context/AuthContext";
// import { useRecipe } from "../hooks/useRecipe";
// import RecipeHeader from "../Components/RecipeHeader";
// import CreatedBy from "../Components/CreatedBy";
// import CookingTime from "../Components/CookingTime";
// import IngredientsList from "../Components/IngredientsList";
// import Instructions from "../Components/Instructions";

// const RecipeInfo = () => {
//   const { RecipeId } = useParams();
//   const { user } = useAuthContext();
//   const fileInputRef = useRef(null);

//   const {
//     recipe,
//     recipeUser,
//     loading,
//     isBookmarked,
//     isEditing,
//     newRecipeTitle,
//     setNewRecipeTitle,
//     newIngredients,
//     setNewIngredients,
//     newInstruction,
//     setNewInstruction,
//     newRecipeDescription,
//     setNewRecipeDescription,
//     newCookingTime,
//     setNewCookingTime,
//     newRecipeImage,
//     setNewRecipeImage,
//     saveEditedRecipe,
//     cancelEditing,
//     setIsEditing,
//     searchQuery,
//     setSearchQuery,
//     suggestedIngredients,
//     addIngredient,
//     removeIngredient
//   } = useRecipe(RecipeId, user);

//   // Check if user is the recipe owner
//   const [recipeOwner] = recipe?.recipe_user || [];
//   const isRecipeOwner = user && recipe && user._id === recipeOwner;

//   if (loading) return <div className="text-center text-gray-700 py-8">Loading...</div>;
//   if (!recipe) return <div className="text-center text-gray-700 py-8">No recipe found.</div>;

//   return (
//     <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100">
//       <NavBar className="sticky top-0 bg-white/90 backdrop-blur-md shadow-sm z-50" />
      
//       <main className="flex-grow">
//         <div className="max-w-7xl mx-auto px-4 xs:px-6 sm:px-8 lg:px-10 py-6 sm:py-8 lg:py-12">
//           <RecipeHeader
//             recipe={recipe}
//             recipeUser={recipeUser}
//             isEditing={isEditing}
//             newRecipeTitle={newRecipeTitle}
//             setNewRecipeTitle={setNewRecipeTitle}
//             setIsEditing={setIsEditing}
//             saveEditedRecipe={saveEditedRecipe}
//             cancelEditing={cancelEditing}
//             fileInputRef={fileInputRef}
//             newRecipeImage={newRecipeImage}
//             setNewRecipeImage={setNewRecipeImage}
//             defaultRecipeImage={defaultRecipeImage}
//             isRecipeOwner={isRecipeOwner}
//             isBookmarked={isBookmarked}
//           />

//           {/* Recipe Details Grid */}
//           <div className="p-4 sm:p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
//             {/* Left Column */}
//             <div>
//               <CreatedBy recipeUser={recipeUser} defaultRecipeImage={defaultRecipeImage} />
//               <CookingTime 
//                 isEditing={isEditing} 
//                 newCookingTime={newCookingTime} 
//                 setNewCookingTime={setNewCookingTime} 
//                 recipe={recipe} 
//               />
//             </div>

//             {/* Right Column */}
//             <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 rounded-xl sm:rounded-2xl">
//               <IngredientsList
//               recipe ={recipe}
//                 isEditing={isEditing}
//                 newIngredients={newIngredients}
//                 setNewIngredients={setNewIngredients}
//                 suggestedIngredients={suggestedIngredients}
//                 setSearchQuery={setSearchQuery}
//                 searchQuery={searchQuery}
//                 addIngredient={addIngredient}
//                 removeIngredient={removeIngredient}
//                 recipe={recipe}
//               />
//             </div>
//           </div>

//           <Instructions 
//             isEditing={isEditing} 
//             newInstruction={newInstruction} 
//             setNewInstruction={setNewInstruction} 
//             recipe={recipe} 
//           />
//         </div>
//       </main>

//       <Footer className="bg-white/90 backdrop-blur-md shadow-inner" />
//     </div>
//   );
// };

// export default RecipeInfo;