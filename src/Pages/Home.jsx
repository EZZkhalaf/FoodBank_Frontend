


// import React, { useEffect, useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { ArrowRight } from 'lucide-react';
// import NavBar from '../Components/NavBar';
// import Footer from '../Components/Footer';
// import { useAuthContext } from '../hooks/useAuthContext';
// import RecipeElement from '../Components/RecipeElement';
// import FeaturedRecipe from '../Components/FeaturedRecipe';

// const Home = () => {
//   const { user } = useAuthContext();
//   const navigate = useNavigate();
//   const [recipes, setRecipes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [categories, setCategories] = useState([]);
//   useEffect(() => {
//     const fetchRecipes = async () => {
//       try {
//         const response = await fetch('http://localhost:3000/recipe');
//         if (!response.ok) throw new Error('Failed to fetch recipes');
//         const data = await response.json();
//         setRecipes(data);
//         const uniqueTypes = [...new Set(data.map(recipe => recipe.type))];
//         setCategories(uniqueTypes);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRecipes();
//   }, []);

//   useEffect(() => {
//     if (!user) navigate('/login');
//     window.scrollTo(0, 0);
//   }, [user, navigate]);

//   const getRecipesByCategory = (category) => {
//     return recipes.filter(recipe => recipe.type === category).slice(0, 3);
//   };

//   if (!user) return null;
//   if (loading) return <div className="text-center p-8">Loading recipes...</div>;
//   if (error) return <div className="text-center p-8 text-red-500">Error: {error}</div>;

//   const featuredRecipe = recipes[0];
//   console.log(featuredRecipe)
//   return (
//     <div className="flex flex-col min-h-screen bg-sand-50">
//       <NavBar />

//       <main className="pt-24 flex-grow">
//         {/* Hero Section */}
//         <section className="relative h-[70vh] min-h-[600px] flex items-center justify-center bg-sand-50">
//           <div className="absolute inset-0 overflow-hidden">
//             <img 
//               src="https://images.unsplash.com/photo-1499028344343-cd173ffc68a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
//               alt="Delicious food"
//               className="w-full h-full object-cover opacity-70"
//             />
//           </div>
          
         


//           <div className="relative z-10 text-center max-w-3xl mx-auto px-4 animate-fade-up">
//             <h1 className="font-serif text-4xl md:text-6xl font-medium mb-6">
//               Welcome back, {user.username}!
//             </h1>
//             <p className="text-xl md:text-2xl text-sand-700 mb-8 max-w-2xl mx-auto">
//               Discover recipes that bring joy to your table, focusing on quality ingredients and straightforward techniques.
//             </p>
//             <Link 
//               to="/findRecipes" 
//               className="inline-block px-8 py-3 bg-spice-500 text-white rounded-lg text-base font-medium hover:bg-spice-600 transition-colors"
//             >
//               Explore Recipes
//             </Link>
//           </div>
//         </section>

//         <section className="page-container mt-5">
//           <h2 className="font-serif text-3xl font-medium mb-8 text-center">Featured Recipe</h2>
//           <FeaturedRecipe recipe={featuredRecipe} />
//         </section>

//         {/* Category Sections */}
//         {categories.map(category => {
//   const categoryRecipes = getRecipesByCategory(category);
//   if (categoryRecipes.length === 0) return null;
  
//   return (
//     <section key={category} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
      
//       {/* Centered Border */}
//       <div className="flex justify-center">
//         <div className="w-[30vw] border-t-2 border-sand-200"></div>
//       </div>

//       <div className="flex justify-between items-center mb-8 mt-5">
//         <h2 className="font-serif text-3xl font-medium">{category}</h2>
//         <Link 
//           to={`/recipes?category=${category}`} 
//           className="text-spice-500 font-medium flex items-center hover:text-spice-600 transition-colors"
//         >
//           View all
//           <ArrowRight className="ml-1 w-4 h-4" />
//         </Link>
//       </div>
      
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//         {categoryRecipes.map(recipe => (
//           <RecipeElement 
//             key={recipe._id}
//             RecipeId={recipe._id}
//             recipe_image={recipe.recipe_image}
//             recipe_name={recipe.recipe_title}
//             recipe_description={recipe.recipe_description}
//             recipeType={recipe.type} 
//             cookingTime ={recipe.cookingTime}
//             difficulty = {recipe.difficullty}
//           />
//         ))}
//       </div>
//     </section>
//   );
// })}

//       </main>

//       <Footer />
//     </div>
//   );
// };

// export default Home;






import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import NavBar from '../Components/NavBar';
import Footer from '../Components/Footer';
import { useAuthContext } from '../hooks/useAuthContext';
import RecipeElement from '../Components/RecipeElement';
import FeaturedRecipe from '../Components/FeaturedRecipe';

const Home = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch('http://localhost:3000/recipe');
        if (!response.ok) throw new Error('Failed to fetch recipes');
        const data = await response.json();
        setRecipes(data);
        const uniqueTypes = [...new Set(data.map(recipe => recipe.type))];
        setCategories(uniqueTypes);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  useEffect(() => {
    if (!user) navigate('/login');
    window.scrollTo(0, 0);
  }, [user, navigate]);

  const getRecipesByCategory = (category) => {
    return recipes.filter(recipe => recipe.type === category).slice(0, 3);
  };

  if (!user) return null;
  if (loading) return <div className="text-center p-8">Loading recipes...</div>;
  if (error) return <div className="text-center p-8 text-red-500">Error: {error}</div>;

  const featuredRecipe = recipes[0];
  console.log(featuredRecipe)
  return (
    <div className="flex flex-col min-h-screen ">
      <NavBar />

      <main className="pt-14 flex-grow">
        {/* Hero Section */}
        <section className="relative h-[70vh] min-h-[600px] flex items-center justify-center bg-sand-50">
          <div className="absolute inset-0 overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1499028344343-cd173ffc68a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
              alt="Delicious food"
              className="w-full h-full object-cover opacity-70"
            />
          </div>
          
         


          <div className="relative z-10 text-center max-w-3xl mx-auto px-4 animate-fade-up">
            <h1 className="font-serif text-4xl md:text-6xl font-medium mb-6">
              Welcome back, {user.username}!
            </h1>
            <p className="text-xl md:text-2xl text-sand-700 mb-8 max-w-2xl mx-auto">
              Discover recipes that bring joy to your table, focusing on quality ingredients and straightforward techniques.
            </p>
            <Link 
              to="/findRecipes" 
              className="inline-block px-8 py-3 bg-spice-500 text-white rounded-lg text-base font-medium hover:bg-spice-600 transition-colors"
            >
              Explore Recipes
            </Link>
          </div>
        </section>

        <section className="page-container mt-5">
          <h2 className="font-serif text-3xl font-medium mb-8 text-center">Featured Recipe</h2>
          <FeaturedRecipe recipe={featuredRecipe} />
        </section>

        {/* Category Sections */}
        {categories.map(category => {
  const categoryRecipes = getRecipesByCategory(category);
  if (categoryRecipes.length === 0) return null;
  
  return (
    <section key={category} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
      
      {/* Centered Border */}
      <div className="flex justify-center">
        <div className="w-[30vw] border-t-2 border-sand-200"></div>
      </div>

      <div className="flex justify-between items-center mb-8 mt-5">
        <h2 className="font-serif text-3xl font-medium">{category}</h2>
        <Link 
          to={`/findRecipes?category=${encodeURIComponent(category)}`} 
          className="text-spice-500 font-medium flex items-center hover:text-spice-600 transition-colors"
        >
          View all
          <ArrowRight className="ml-1 w-4 h-4" />
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {categoryRecipes.map(recipe => (
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
        ))}
      </div>
    </section>
  );
})}

      </main>

      <Footer />
    </div>
  );
};

export default Home;