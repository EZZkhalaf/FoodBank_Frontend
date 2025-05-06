import React ,{useState , useEffect}from 'react'
import RecipeElement from './RecipeElement';

import { useAuthContext } from '../Context/AuthContext';
import { ThreeDot } from 'react-loading-indicators';
import RecipeElementFeed from './RecipeElementFeed';

const UserHomeFeed = () => {
 const { user } = useAuthContext(); // Import your auth context
const [feedRecipes, setFeedRecipes] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
useEffect(() => {
    if (!user?._id) return;

    const fetchFeed = async () => {
        setLoading(true);
        setError(null);

        // Get token either from localStorage or from context
        const token = localStorage.getItem('token') || user.token;
        try {
            const res = await fetch('http://localhost:3000/user/getUserFeed', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            });
            if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
            const data = await res.json();
            setFeedRecipes(data);
        } catch (err) {
            console.error('Failed to fetch feed:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
  

  
    fetchFeed();
  
}, [user]);

if (loading) {
  return <div className="flex items-center justify-center p-6">
    <ThreeDot color={["#32cd32", "#327fcd", "#cd32cd", "#cd8032"]} />
  </div>;
}
if (error) {
  return <div className="text-red-500 text-center p-4">
    Error loading feed: {error}
  </div>;
}

return (
  <div className="mt-8">
    <h2 className="font-serif text-2xl font-medium mb-4 text-center">Your Feed</h2>
    <div className="flex flex-col space-y-6 px-4">
      {feedRecipes.map(recipe => (
        // RecipeId, recipe_image, recipe_name, recipe_description, recipeType, cookingTime, difficulty
        <RecipeElementFeed 
          key={recipe._id}
          RecipeId={recipe._id}
          recipe_name={recipe.recipe_title}
          recipeType={recipe.type}
          recipe_description={recipe.recipe_description}
          recipe_image={recipe.recipe_image}
          difficulty = {recipe.difficulty}
          recipe_user={ recipe.recipe_user}
        />
      ))}
    </div>
  </div>
);
}

export default UserHomeFeed