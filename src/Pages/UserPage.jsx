import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import defaultPhoto from "../assets/defaultPhoto.png";
import ProfileRecipeElement from "../Components/profileRecipeElement";
import { useAuthContext } from "../Context/AuthContext";
import RecipeElement from "../Components/RecipeElement";

const UserPage = () => {
  const { user } = useAuthContext();
  const { user2_id } = useParams();
  const [userPageOwner, setUserPageOwner] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const userProfilePic =
    userPageOwner?.profilePic && userPageOwner.profilePic !== "/assets/defaultPhoto.png"
      ? userPageOwner.profilePic
      : defaultPhoto;

  // Fetch user data
  useEffect(() => {
    if (!user2_id) return;

    const fetchUserData = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:3000/user/getUserById", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user2_id }),
        });

        if (!res.ok) throw new Error(`Error: ${res.statusText}`);

        const profileUser = await res.json();
        setUserPageOwner(profileUser);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    const interval = setInterval(fetchUserData, 10000);
    return () => clearInterval(interval);
  }, [user2_id]);

  // Fetch user recipes
  useEffect(() => {
    if (!userPageOwner?._id) return; // Ensure userPageOwner._id is available

    const fetchUserRecipes = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:3000/recipe/getUserRecipes/${userPageOwner._id}`

        );
        if (!res.ok) throw new Error(`Error: ${res.statusText}`);

        const data = await res.json();
        console.log("User recipes:", data);
        setRecipes(data);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRecipes();
  }, [userPageOwner?._id]); // Add userPageOwner._id as a dependency

  if (loading) return <div>Loading...</div>;
  if (!userPageOwner) return <div>User not found</div>;

  return (
    <div className="w-full mx-5 xl:mx-auto max-w-6xl p-6">
      <div className="bg-white rounded-xl shadow-lg p-8">
        {/* User Profile Section */}
        <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
          <img
            src={userProfilePic}
            alt={`${userPageOwner.username}'s profile`}
            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
          />
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-800">
              {userPageOwner.username || "Guest"}
            </h1>
            <p className="text-gray-600 mt-2">
              {userPageOwner.bio || "No bio available"}
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 text-center">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-xl font-bold text-gray-800">
              {userPageOwner.followers?.length || 0}
            </p>
            <p className="text-gray-600">Followers</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-xl font-bold text-gray-800">
              {userPageOwner.following?.length || 0}
            </p>
            <p className="text-gray-600">Following</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-xl font-bold text-gray-800">
              {userPageOwner.ownRecipes?.length || 0}
            </p>
            <p className="text-gray-600">Recipes</p>
          </div>
        </div>

        {/* Recipes Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Recipes</h2>
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">My Recipes</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.length > 0 ? (
                recipes.map((recipe) => (
                  <RecipeElement
                    key={recipe._id}
                    RecipeId={recipe._id}
                    recipe_image={recipe.recipe_image}
                    recipe_name={recipe.recipe_title}
                  />
                ))
              ) : (
                <p className="text-gray-600">No recipes created yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPage;