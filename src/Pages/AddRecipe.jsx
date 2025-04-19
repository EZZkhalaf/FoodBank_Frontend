import React, { useState } from 'react';
import { useAuthContext } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import NavBar from '../Components/NavBar';
import Footer from '../Components/Footer';

const AddRecipe = () => {
  const [formData, setFormData] = useState({
    recipe_title: '',
    recipe_description: '',
    instructions: '',
    type: '',
    ingredients: [{ name: '', quantity: '' }],
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isImageExpanded, setIsImageExpanded] = useState(false);
  const { user } = useAuthContext();
  const userId = user?._id;
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleIngredientChange = (index, e) => {
    const { name, value } = e.target;
    const updatedIngredients = [...formData.ingredients];
    updatedIngredients[index][name] = value;
    setFormData({ ...formData, ingredients: updatedIngredients });
  };

  const addIngredient = () => {
    setFormData({
      ...formData,
      ingredients: [...formData.ingredients, { name: '', quantity: '' }],
    });
  };

  const removeIngredient = (index) => {
    const updatedIngredients = [...formData.ingredients];
    updatedIngredients.splice(index, 1);
    setFormData({ ...formData, ingredients: updatedIngredients });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };





  const compressImage = async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const img = new Image();
        img.onload = async () => {
          const canvas = document.createElement('canvas');
          const max_size = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > max_size) {
              height *= max_size / width;
              width = max_size;
            }
          } else {
            if (height > max_size) {
              width *= max_size / height;
              height = max_size;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              resolve(blob);
            },
            file.type,
            0.7 // compression quality
          );
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  };





  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      if (!formData.recipe_title || !formData.instructions ||
        !formData.ingredients.length || !userId || !formData.type) {
        setError('Please fill all required fields');
        setLoading(false);
        return;
      }

      const invalidIngredients = formData.ingredients.some(
        (ing) => !ing.name.trim() || !ing.quantity.trim()
      );
      if (invalidIngredients) {
        setError('All ingredients must have name and quantity');
        setLoading(false);
        return;
      }

      let imageData = '';
      if (selectedFile) {
        // Compress the image
        const compressedFile = await compressImage(selectedFile);
        // Convert to base64
        const reader = new FileReader();
        reader.onload = (event) => {
          imageData = event.target.result;
        };
        reader.readAsDataURL(compressedFile);
        // Wait for the reader to finish
        await new Promise((resolve) => reader.onloadend = resolve);
      } else {
        imageData = formData.recipe_image;
      }

      const response = await fetch('http://localhost:3000/recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        //making the body in array for the controller to handle multiple recipes if needed 
        body: JSON.stringify([{
          ...formData,
          recipe_image: imageData,
          recipe_user: userId,
        }]),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setFormData({
          recipe_title: '',
          recipe_description: '',
          instructions: '',
          type: '',
          ingredients: [{ name: '', quantity: '' }],
        });
        setSelectedFile(null);
        setPreviewImage(null);
        navigate(`/userprofile/${userId}`);
      } else {
        setError(data.message || 'Error adding recipe');
      }
    } catch (err) {
      setError('Error adding recipe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100">
      <NavBar />

      <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100">
        <main className="flex-grow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-16"> 
            <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden ring-2 ring-purple-200 ring-offset-2 p-10">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b-2 border-purple-300 pb-2">
                Add New Recipe
              </h2>

              {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded-md">
                  {error}
                </div>
              )}
              {success && (
                <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded-md">
                  Recipe added successfully!
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title:
                    </label>
                    <input
                      type="text"
                      name="recipe_title"
                      value={formData.recipe_title}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white rounded-xl shadow-sm border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Recipe Type:
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white rounded-xl shadow-sm border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      required
                    >
                      <option value="">Select type</option>
                      <option value="Appetizer">Appetizer</option>
                      <option value="Main Course">Main Course</option>
                      <option value="Breakfast">Breakfast</option>
                      <option value="Dessert">Dessert</option>
                      <option value="Soup">Soup</option>
                      <option value="Salad">Salad</option>
                      <option value="Beverage">Beverage</option>
                      <option value="Side Dish">Side Dish</option>
                      <option value="Snack">Snack</option>
                      <option value="Vegan">Vegan</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description:
                    </label>
                    <textarea
                      name="recipe_description"
                      value={formData.recipe_description}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white rounded-xl shadow-sm border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:outline-none resize-none h-32"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Instructions:
                    </label>
                    <textarea
                      name="instructions"
                      value={formData.instructions}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white rounded-xl shadow-sm border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:outline-none resize-none h-32"
                      required
                    />
                  </div>
                </div>

                <div className="mt-6 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-8 rounded-2xl">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Ingredients</h3>

                  {formData.ingredients.map((_, index) => (
                    <div key={index} className="flex gap-2 items-center p-3 bg-white rounded-lg shadow-sm mb-2">
                      <input
                        type="text"
                        name="name"
                        value={formData.ingredients[index].name}
                        onChange={(e) => handleIngredientChange(index, e)}
                        placeholder="Ingredient name"
                        className="flex-1 bg-transparent border-none outline-none"
                        required
                      />
                      <input
                        type="text"
                        name="quantity"
                        value={formData.ingredients[index].quantity}
                        onChange={(e) => handleIngredientChange(index, e)}
                        placeholder="Quantity"
                        className="flex-1 bg-transparent border-none outline-none"
                        required
                      />
                      {formData.ingredients.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeIngredient(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addIngredient}
                    className="mt-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-md hover:from-purple-600 hover:to-blue-700 transition-all duration-300 ease-in-out"
                  >
                    Add Ingredient
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Image:
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        name="recipe_image"
                        value={formData.recipe_image}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white rounded-xl shadow-sm border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                        placeholder="Or enter image URL"
                        style={{ flex: 3 }} // Make the textbox wider
                      />
                      <label className="cursor-pointer px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-md">
                        Upload
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {previewImage && (
                  <div className="mt-4 cursor-pointer" onClick={() => setIsImageExpanded(!isImageExpanded)}>
                    {isImageExpanded ? (
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="max-h-[80vh] max-w-[80vw] object-cover rounded-xl shadow-lg mx-auto block"
                      />
                    ) : (
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="w-64 h-48 object-cover rounded-xl shadow-md"
                      />
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full px-6 py-3 mt-6 rounded-full ${loading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-500 to-blue-600 text-white'
                    }`}
                >
                  {loading ? 'Submitting...' : 'Submit Recipe'}
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default AddRecipe;