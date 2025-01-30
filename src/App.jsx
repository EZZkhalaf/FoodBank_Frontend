
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './Pages/Home'
import Login from './Pages/Login'
import NavBar from './Components/NavBar'
import RecipeInfo from './Pages/RecipeInfo'
import UserProfile from './Pages/UserProfile'
import UserRecipes from './Pages/UserRecipes'
import { Component } from 'react'

const initialState =  {
  username :'' ,
  email :'',
  password : '',
  friends : [],
  followers : [],
  following : [],
  ownRecipes : [],
  savedRecipes : []
}





class App extends Component {
  constructor(){
    super();
    this.state = initialState;
  }

  loadUser = (data) => {
    // Using setState to update the state correctly
    this.setState({
      id: data._id,
      username: data.username,
      email: data.email,
      friends: data.friends,
      followers: data.followers,
      following: data.following,
      ownRecipes: data.ownRecipes,
      savedRecipes: data.savedRecipes,
    });
  };
  


  

  render(){
    return (
      
      <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
        {/* <NavBar /> */}
        <h1>Welcome, {this.state.email}</h1>
          <Routes>       
                <Route  path='/home' element ={ <Home />  } />
                <Route path='/login' element={ <Login loadUser = {this.loadUser} /> }/>
                <Route path='/recipe/:recipeId' element={<RecipeInfo />} />
                <Route path='/userprofile/:userId' element={<UserProfile />} />
                <Route path='/ownRecipes' element={<UserRecipes />} />
          </Routes>
        
      </div>
        
      
    
   )
}
}

export default App
