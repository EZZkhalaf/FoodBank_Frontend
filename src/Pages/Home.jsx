
import React, { useEffect, useState , useRef  } from 'react';
import { useNavigate, Link , useLocation} from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import NavBar from '../Components/NavBar';
import Footer from '../Components/Footer';
import { useAuthContext } from '../hooks/useAuthContext';
import RecipeElement from '../Components/RecipeElement';
import FeaturedRecipe from '../Components/FeaturedRecipe';
import CategorySection from '../Components/CategorySection';  
import { ThreeDot } from 'react-loading-indicators';
import './HomeAnimation.css'

const Home = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const sectionRef = useRef(null);
  const [featuredRecipe , setFeaturedRecipe] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch('http://localhost:3000/recipe');
        if (!response.ok) throw new Error('Failed to fetch recipes');
        const data = await response.json();
        setRecipes(data);
        const uniqueTypes = [...new Set(data.map(recipe => recipe.type))];
        setCategories(uniqueTypes);

        //this hook for the most bookmarked recipe fetching 
        const response2 = await fetch('http://localhost:3000/recipe/mostPopularRecipe/first');
        if (!response2.ok) {
          console.error("Error in the response from the backend:", response2.statusText);
          return;
        }
        const data2 = await response2.json();
        
        setFeaturedRecipe(data2);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    

    fetchRecipes();
  }, []);


  useEffect(() => {
    const element = sectionRef.current;
    if(element){
      element.classList.remove('slide-in-left-soft'); //reset
      void element.offsetWidth;
      element.classList.add('slide-in-left-soft');
    }
  }, [location.pathname]);



  useEffect(() => {
    if (!user) navigate('/login');
    window.scrollTo(0, 0);
  }, [user, navigate]);

  const getRecipesByCategory = (category) => {
    return recipes.filter(recipe => recipe.type === category).slice(0, 3);
  };

  if (!user) return null;



  if (loading)     
    return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="p-6 rounded-lg shadow-md bg-white border border-gray-200">
        <ThreeDot color={["#32cd32", "#327fcd", "#cd32cd", "#cd8032"]} />
      </div>
    </div>
  );
  
if (error) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center p-8 text-red-500">
        Error: {error}
      </div>
    </div>
  );
}







  return (

    <div className="flex flex-col min-h-screen">
      <NavBar />

      <main className="pt-14 flex-grow">
        {/* Hero Section */}
 



        <section 
            ref={sectionRef}
            className="relative h-[70vh] min-h-[600px] flex items-center justify-center bg-sand-50 bg-blur"
          >
            <div className="absolute inset-0 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1499028344343-cd173ffc68a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="Delicious food"
                className="w-full h-full object-cover opacity-70"
              />
            </div>

            <div className="relative z-10 text-center max-w-3xl mx-auto px-4 slide-up">
              <h1 className="font-serif text-4xl md:text-6xl font-medium mb-6 fade-in">
                Welcome back, {user.username}!
              </h1>
              <p className="text-xl md:text-2xl text-sand-700 mb-8 max-w-2xl mx-auto fade-in-delay">
                Discover recipes that bring joy to your table, focusing on quality ingredients and straightforward techniques.
              </p>
              <Link
                to="/findRecipes"
                className="inline-block px-8 py-3 bg-spice-500 text-white rounded-lg text-base font-medium hover:bg-spice-600 transition-colors fade-in-delay"
              >
                Explore Recipes
              </Link>
            </div>
          </section>




        <section className="page-container mt-5">
          <h2 className="font-serif text-3xl font-medium mb-8 text-center">Featured Recipe</h2>
          <div className="animate-scroll">
            <FeaturedRecipe recipe={featuredRecipe} />
          </div>
        </section>

        {/* Category Sections */}
        {categories.slice(0, 3).map(category => { // Limit to 4 categories
          const categoryRecipes = getRecipesByCategory(category);

            return (
              <CategorySection
                key={category}
                category={category}
                recipes={categoryRecipes}
              />
            );
          })}


      </main>

      <Footer />
    </div>
  );
};

export default Home;
