import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter , Route , Routes} from 'react-router-dom'
import { AuthProvider } from './Context/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
            <App />
      </BrowserRouter>     
    </AuthProvider>
  </StrictMode>
  
)



// /src
//   /components
//     - Navbar.jsx(done)
//     - Footer.jsx(done)
//     - RecipeCard.jsx
//     - RecipeForm.jsx
//     - SearchBar.jsx
//   /pages
//     - Home.jsx(working on it)
//     - Login.jsx(done)
//     - SignUp.jsx(done)
//     - UserProfile.jsx
//     - Recipes.jsx
//     - RecipeDetails.jsx
//     - AddRecipe.jsx
//     - EditRecipe.jsx
//   /context
//     - AuthContext.jsx
//     - RecipeContext.jsx
//   /routes
//     - AppRoutes.jsx
//   /assets
//   /styles
//   /utils
//   main.jsx
//   App.jsx