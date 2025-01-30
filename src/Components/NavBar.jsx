// import React from 'react';
// import logo from '../assets/logo.png';
// import { IoReorderThreeSharp } from "react-icons/io5";


// const NavBar = () => {
//   return (
//     <>
//       <nav className="bg-white flex flex-col md:flex-row justify-between items-center p-4 shadow-md h-auto md:h-[5vw]">
//         {/* Logo */}
//         <img
//           src={logo}
//           alt="logo"
//           className="w-18 h-12 md:h-[5vw] mb-4 md:mb-0"
//         />

//         {/* Navigation Links and Sign Out Button */}
//         <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-center w-full max-w-4xl mx-auto">
//           {/* Centered Navigation Links */}
//           <ul className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 flex-grow">
//             <li className="hover:text-gray-400 transition-colors duration-200">
//               <a href="#" className="text-gray-700">Profile</a>
//             </li>
//             <li className="hover:text-gray-400 transition-colors duration-200">
//               <a href="#" className="text-gray-700">Own Recipes</a>
//             </li>
//             <li className="hover:text-gray-400 transition-colors duration-200">
//               <a href="#" className="text-gray-700">Search</a>
//             </li>
//           </ul>

//           {/* Sign Out Button */}
//           <button className="bg-[#a6c1ee] text-white px-5 py-2 hover:bg-[#87acec] rounded-full transition-colors duration-200">
//             Sign out
//           </button>
//         </div>
//       </nav>
//     </>
//   );
// };

import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import logo from '../assets/logo.png';
import { CiSearch, CiShoppingCart } from 'react-icons/ci';
import { CgProfile } from 'react-icons/cg';
import { IoMdMenu, IoMdClose } from "react-icons/io";

const NavBar = () => {
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed w-full top-0 z-50 bg-gray-900 text-white shadow-lg left-0 h-20 flex items-center">
      <div className="flex px-6 w-full justify-between items-center">
        
        {/* Logo */}
        <Link to="/" className="text-green-500 hover:text-green-300 transition duration-300">
          <img src={logo} alt="Logo" className="h-16" />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8">
          
          <NavLink to="/collection" className="hover:text-green-300 transition duration-300">
            Collection
          </NavLink>
          <NavLink to="/about" className="hover:text-green-300 transition duration-300">
            About
          </NavLink>
          <NavLink to="/contact" className="hover:text-green-300 transition duration-300">
            Contact
          </NavLink>
        </div>

        {/* Icons (Search, Profile, Cart) */}
        <div className="flex items-center space-x-6">
          {/* Search Button */}
          <button className="text-xl hover:bg-white hover:text-green-300 transition duration-300 rounded-md p-2">
            <CiSearch className="transition duration-300 hover:text-black" />
          </button>

          {/* Profile Icon */}
          <div className="relative">
            <button
              onClick={() => setProfileMenuOpen(!isProfileMenuOpen)}
              className="text-xl hover:bg-white transition duration-300 rounded-md p-2"
            >
              <CgProfile className="transition duration-300 hover:text-black" />
            </button>

            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-black shadow-lg rounded-lg py-2">
                <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100 transition-colors duration-200">
                  My Profile
                </Link>
                <Link to="/orders" className="block px-4 py-2 hover:bg-gray-100 transition-colors duration-200">
                  Own Recipes
                </Link>
                <button className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors duration-200">
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Cart Icon */}
          <div className="relative flex">
            <NavLink to="/cart" className="hover:text-green-300 transition duration-300">
              <button className="text-xl hover:bg-white hover:text-green-300 transition duration-300 rounded-md p-2">
                <CiShoppingCart className="transition duration-300 hover:text-black" />
              </button>
              <span className="absolute top-0 right-0 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center bg-red-500">
                55
              </span>
            </NavLink>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} className="text-2xl focus:outline-none">
              {isMobileMenuOpen ? <IoMdClose /> : <IoMdMenu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-20 left-0 w-full bg-gray-900 z-50 h-screen md:hidden flex flex-col items-center mt-4 space-y-6">
          
          <NavLink to="/collection" onClick={() => setMobileMenuOpen(false)} className="text-white hover:text-green-300 text-lg">
            Collection
          </NavLink>
          <NavLink to="/about" onClick={() => setMobileMenuOpen(false)} className="text-white hover:text-green-300 text-lg">
            About
          </NavLink>
          <NavLink to="/contact" onClick={() => setMobileMenuOpen(false)} className="text-white hover:text-green-300 text-lg">
            Contact
          </NavLink>
        </div>
      )}
    </nav>
  );
};

export default NavBar;

