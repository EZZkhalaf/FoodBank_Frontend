// import React, { useState, useEffect, useRef } from 'react';
// import { Link, NavLink } from 'react-router-dom';
// import logo from '../assets/logo.png';
// import { CiSearch, CiShoppingCart } from 'react-icons/ci';
// import { CgProfile } from 'react-icons/cg';
// import { IoMdMenu, IoMdClose } from "react-icons/io";
// import { useNavigate } from 'react-router-dom';
// import { useAuthContext } from '../hooks/useAuthContext';
// import NavSearchBox from './NavSearchBox';
// import { FaBookBookmark } from "react-icons/fa6";


// const NavBar = () => {
//   const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
//   const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [searchOpen , setSearchOpen] = useState(false);
//   const profileMenuRef = useRef(null);
//   const navigate = useNavigate();
//   const {user , dispatch} = useAuthContext();

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     dispatch({type:'logout'});
//     navigate('/login');
//   };

 

//   // Close Profile Menu when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
//         setProfileMenuOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);
  
//   return (
//     <nav className="fixed w-full top-0 z-50 bg-gray-900 text-white shadow-lg left-0 h-20 flex items-center">
//       <div className="flex px-6 w-full justify-between items-center">
        
//         {/* Logo */}
//         <Link to="/" className="text-green-500 hover:text-green-300 transition duration-300">
//           <img src={logo} alt="Logo" className="h-16" />
//         </Link>

//         {/* Desktop Menu */}
//         <div className="hidden md:flex space-x-8">
//           <NavLink to="/" className="hover:text-green-300 transition duration-300">
//             Home
//           </NavLink>
//           <NavLink to="/findRecipes" className="hover:text-green-300 transition duration-300">
//             Recipes
//           </NavLink>
          
//         </div>

//         {/* Icons (Search, Profile, Cart) */}
//         <div className="flex items-center space-x-6">


         
//           <div className="relative">
//             <button 
//               onClick={() => setSearchOpen(true)}
//               className="text-xl bg-gray-800 hover:bg-gray-700 transition-all duration-300 rounded-full p-3 shadow-md border border-gray-600 focus:ring-2 focus:ring-green-400 focus:outline-none"
//             >
//               <CiSearch className="text-white" />
//             </button>

//             {searchOpen && (
//               <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-[300px] bg-white p-3 rounded-md shadow-lg mt-0">
//                 <NavSearchBox setSearchOpen={setSearchOpen} />
//               </div>
//             )}
//           </div>

//           {/* Profile Icon */}
//           <div className="relative" ref={profileMenuRef}>
//             <button
//               onClick={() => setProfileMenuOpen(!isProfileMenuOpen)}
//               className="text-xl hover:bg-gray-700 transition duration-300 rounded-md p-2 focus:outline-none"
//             >
//               <CgProfile />
//             </button>

//             {isProfileMenuOpen && user && (
//               <div className="absolute right-0 mt-2 w-48 bg-white text-black shadow-lg rounded-lg py-2">
//                 <Link to={`/userprofile/:${user._id}`} className="block px-4 py-2 hover:bg-gray-100 transition-colors duration-200">
//                   My Profile
//                 </Link>
//                 <Link to="/my-recipes" className="block px-4 py-2 hover:bg-gray-100 transition-colors duration-200">
//                   My Recipes
//                 </Link>
//                 <button 
//                   onClick={handleLogout}
//                   className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors duration-200"
//                 >
//                   Logout
//                 </button>
//               </div>
//             )}
//             {isProfileMenuOpen && !user &&(
//               <div className="absolute right-0 mt-2 w-48 bg-white text-black shadow-lg rounded-lg py-2">
//                 <Link to={`/login`} className="block px-4 py-2 hover:bg-gray-100 transition-colors duration-200">
//                   login
//                 </Link>
//                 <Link to="/register" className="block px-4 py-2 hover:bg-gray-100 transition-colors duration-200">
//                   create a new account
//                 </Link>
                
//               </div>
//             )}
//           </div>

//           {/* Cart Icon */}
//           <div className="relative flex">
//             <NavLink to="/savedRecipes" className="hover:text-green-300 transition duration-300">
//               <button className="text-xl hover:bg-gray-700 transition duration-300 rounded-md p-2 focus:outline-none">
//                 <FaBookBookmark />
//               </button>
              
//             </NavLink>
//           </div>

//           {/* Mobile Menu Toggle */}
//           <div className="md:hidden">
//             <button 
//               onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} 
//               className="text-2xl focus:outline-none"
//             >
//               {isMobileMenuOpen ? <IoMdClose /> : <IoMdMenu />}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       {isMobileMenuOpen && (

//         <div className="fixed top-20 left-0 w-full h-[calc(100vh-5rem)] bg-gray-900 z-50 md:hidden">
//           <div className="flex flex-col items-center py-8 space-y-6">
//             <NavLink
//               to="/"
//               onClick={() => setMobileMenuOpen(false)}
//               className="text-white hover:text-green-400 text-lg transition-colors duration-300"
//             >
//               Home
//             </NavLink>


//             <NavLink
//               to="/findRecipes"
//               onClick={() => setMobileMenuOpen(false)}
//               className="text-white hover:text-green-400 text-lg transition-colors duration-300"
//             >
//               Recipes
//             </NavLink>
            
//             {user && (
//               <NavLink
//                 to={`/userprofile/${user._id}`}
//                 onClick={() => setMobileMenuOpen(false)}
//                 className="text-white hover:text-green-400 text-lg transition-colors duration-300"
//               >
//                 My Profile
//               </NavLink>
//             )}
            
//             {user && (
//               <button
//                 onClick={handleLogout}
//                 className="text-red-400 hover:text-red-500 text-lg transition-colors duration-300"
//               >
//                 Logout
//               </button>
//             )}
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// };

// export default NavBar;



import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../assets/logo.png";
import { CiSearch, CiShoppingCart } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";
import { IoMdMenu, IoMdClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import NavSearchBox from "./NavSearchBox";
import { FaBookBookmark } from "react-icons/fa6";

const NavBar = () => {
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const navigate = useNavigate();
  const { user, dispatch } = useAuthContext();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch({ type: "logout" });
    navigate("/login");
  };

  // Close Profile Menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="fixed w-full top-0 z-50 bg-gray-900 text-white shadow-lg left-0 h-20 flex items-center">
      <div className="flex px-6 w-full justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-green-500 hover:text-green-300 transition duration-300">
          <img src={logo} alt="Logo" className="h-16" />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8">
          <NavLink to="/" className="hover:text-green-300 transition duration-300">
            Home
          </NavLink>
          <NavLink to="/findRecipes" className="hover:text-green-300 transition duration-300">
            Recipes
          </NavLink>
        </div>

        {/* Icons (Search, Profile, Cart) */}
        <div className="flex items-center space-x-6">
          {/* Search Icon */}
          <div className="relative">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-xl bg-gray-800 hover:bg-gray-700 transition-all duration-300 rounded-full p-3 shadow-md border border-gray-600 focus:ring-2 focus:ring-green-400 focus:outline-none"
            >
              <CiSearch className="text-white" />
            </button>

            {/* Search Box */}
            {searchOpen && (
              <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-[300px] bg-white p-3 rounded-md shadow-lg mt-0">
                <NavSearchBox setSearchOpen={setSearchOpen} />
              </div>
            )}
          </div>

          {/* Profile Icon */}
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => setProfileMenuOpen(!isProfileMenuOpen)}
              className="text-xl hover:bg-gray-700 transition duration-300 rounded-md p-2 focus:outline-none"
            >
              <CgProfile />
            </button>

            {/* Profile Dropdown */}
            {isProfileMenuOpen && user && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-black shadow-lg rounded-lg py-2">
                <Link to={`/userprofile/:${user._id}`} className="block px-4 py-2 hover:bg-gray-100 transition-colors duration-200">
                  My Profile
                </Link>
                <Link to="/my-recipes" className="block px-4 py-2 hover:bg-gray-100 transition-colors duration-200">
                  My Recipes
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            )}
            {isProfileMenuOpen && !user && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-black shadow-lg rounded-lg py-2">
                <Link to={`/login`} className="block px-4 py-2 hover:bg-gray-100 transition-colors duration-200">
                  Login
                </Link>
                <Link to="/register" className="block px-4 py-2 hover:bg-gray-100 transition-colors duration-200">
                  Create a New Account
                </Link>
              </div>
            )}
          </div>

          {/* Cart Icon */}
          <div className="relative flex">
            <NavLink to="/savedRecipes" className="hover:text-green-300 transition duration-300">
              <button className="text-xl hover:bg-gray-700 transition duration-300 rounded-md p-2 focus:outline-none">
                <FaBookBookmark />
              </button>
            </NavLink>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              className="text-2xl focus:outline-none"
            >
              {isMobileMenuOpen ? <IoMdClose /> : <IoMdMenu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed top-20 left-0 w-full h-[calc(100vh-5rem)] bg-gray-900 z-50 md:hidden">
          <div className="flex flex-col items-center py-8 space-y-6">
            <NavLink
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-white hover:text-green-400 text-lg transition-colors duration-300"
            >
              Home
            </NavLink>
            <NavLink
              to="/findRecipes"
              onClick={() => setMobileMenuOpen(false)}
              className="text-white hover:text-green-400 text-lg transition-colors duration-300"
            >
              Recipes
            </NavLink>
            {user && (
              <NavLink
                to={`/userprofile/${user._id}`}
                onClick={() => setMobileMenuOpen(false)}
                className="text-white hover:text-green-400 text-lg transition-colors duration-300"
              >
                My Profile
              </NavLink>
            )}
            {user && (
              <button
                onClick={handleLogout}
                className="text-red-400 hover:text-red-500 text-lg transition-colors duration-300"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;