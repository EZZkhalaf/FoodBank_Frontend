import React, { useState } from 'react';
import { useAuthContext } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';

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
        body: JSON.stringify({
          ...formData,
          recipe_image: imageData,
          recipe_user: userId,
        }),
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
        navigate(`/recipe/${data.recipeId}`);
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
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Recipe</h2>
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">
          Recipe added successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title:
          </label>
          <input
            type="text"
            name="recipe_title"
            value={formData.recipe_title}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description:
          </label>
          <textarea
            name="recipe_description"
            value={formData.recipe_description}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type:
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            required
          >
            <option value="">Select type</option>
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="dessert">Dessert</option>
            <option value="snack">Snack</option>
          </select>
        </div>

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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Or enter image URL"
            />
            <label className="cursor-pointer bg-blue-500 text-white px-3 py-1 rounded-md">
              Upload
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="fileInput"
              />
            </label>
          </div>
        </div>

        {previewImage && (
          <div className="mt-4">
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-full h-auto rounded-md"
            />
          </div>
        )}

        <div className="mt-4">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Ingredients</h3>
          {formData.ingredients.map((_, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                name="name"
                value={formData.ingredients[index].name}
                onChange={(e) => handleIngredientChange(index, e)}
                placeholder="Ingredient name"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
              <input
                type="text"
                name="quantity"
                value={formData.ingredients[index].quantity}
                onChange={(e) => handleIngredientChange(index, e)}
                placeholder="Quantity"
                className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
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
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Add Ingredient
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full px-4 py-2 rounded-md ${loading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-green-500 text-white hover:bg-green-600'
            }`}
        >
          {loading ? 'Submitting...' : 'Submit Recipe'}
        </button>
      </form>
    </div>
  );
};

export default AddRecipe;