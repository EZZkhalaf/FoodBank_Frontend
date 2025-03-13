

import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../assets/logo.png";
import { CiSearch } from "react-icons/ci";
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
  const [isScrolled, setIsScrolled] = useState(false);
  const profileMenuRef = useRef(null);
  const navigate = useNavigate();
  const { user, dispatch } = useAuthContext();


  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
  };
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch({ type: "logout" });
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // return (
  //   <header 
  //     className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
  //       isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
  //     }`}
  //   >
  //     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  //       <div className="flex items-center justify-between h-16">
  //         {/* Logo */}
  //         <div className="flex-shrink-0">
  //           <Link to="/" className="font-serif text-2xl font-semibold tracking-tight text-foreground">
  //             <img src={logo} alt="Logo" className="h-12" />
  //           </Link>
  //         </div>

  //         {/* Desktop Menu */}
  //         <nav className="hidden md:flex space-x-8">
  //           <NavLink
  //             to="/"
  //             className={({ isActive }) => `transition-colors duration-200 font-medium ${
  //               isActive ? 'text-spice-500' : 'text-foreground/80 hover:text-foreground'
  //             }`}
  //           >
  //             Home
  //           </NavLink>
  //           <NavLink
  //             to="/findRecipes"
  //             className={({ isActive }) => `transition-colors duration-200 font-medium ${
  //               isActive ? 'text-spice-500' : 'text-foreground/80 hover:text-foreground'
  //             }`}
  //           >
  //             Recipes
  //           </NavLink>
  //         </nav>

  //         {/* Icons Section */}
  //         <div className="flex items-center space-x-4">
  //           {/* Search */}
  //             <div className="relative">
  //               <button
  //                   onClick={toggleSearch}
  //                   className={`p-2 rounded-full transition-colors ${
  //                     searchOpen ? "bg-gray-200" : "hover:bg-gray-100"
  //                   }`}
  //                   aria-label="Search"
  //                 >
  //                   <CiSearch className="h-5 w-5" />
  //                 </button>

  //                 {searchOpen && (
  //                   <div className="absolute top-12 right-0 w-72 bg-white p-4 rounded-lg shadow-xl">
  //                     <NavSearchBox setSearchOpen={setSearchOpen} />
  //                   </div>
  //                 )}
  //               </div>




  //           {/* Profile */}
  //           <div className="relative" ref={profileMenuRef}>
  //             <button
  //               onClick={() => setProfileMenuOpen(!isProfileMenuOpen)}
  //               className="btn btn-ghost btn-icon"
  //               aria-label="Profile"
  //             >
  //               <CgProfile className="w-5 h-5" />
  //             </button>
              
  //             {isProfileMenuOpen && (
  //               <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2 animate-fade-in">
  //                 {user ? (
  //                   <>
  //                     <Link to={`/userprofile/${user._id}`} className="block px-4 py-2 hover:bg-sand-100 transition-colors">
  //                       My Profile
  //                     </Link>
  //                     <Link to="/my-recipes" className="block px-4 py-2 hover:bg-sand-100 transition-colors">
  //                       My Recipes
  //                     </Link>
  //                     <button 
  //                       onClick={handleLogout}
  //                       className="w-full text-left px-4 py-2 hover:bg-sand-100 transition-colors"
  //                     >
  //                       Logout
  //                     </button>
  //                   </>
  //                 ) : (
  //                   <>
  //                     <Link to="/login" className="block px-4 py-2 hover:bg-sand-100 transition-colors">
  //                       Login
  //                     </Link>
  //                     <Link to="/register" className="block px-4 py-2 hover:bg-sand-100 transition-colors">
  //                       Register
  //                     </Link>
  //                   </>
  //                 )}
  //               </div>
  //             )}
  //           </div>

  //           {/* Saved Recipes */}
  //           <NavLink 
  //             to="/savedRecipes" 
  //             className={({ isActive }) => `btn btn-ghost btn-icon ${isActive ? 'text-spice-500' : ''}`}
  //           >
  //             <FaBookBookmark className="w-5 h-5" />
  //           </NavLink>

  //           {/* Mobile Menu Toggle */}
  //           <button
  //             onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
  //             className="btn btn-ghost btn-icon md:hidden"
  //             aria-label="Menu"
  //           >
  //             {isMobileMenuOpen ? <IoMdClose className="w-5 h-5" /> : <IoMdMenu className="w-5 h-5" />}
  //           </button>
  //         </div>
  //       </div>
  //     </div>

  //     {/* Mobile Menu */}
  //     {isMobileMenuOpen && (
  //       <div className="md:hidden bg-white/95 backdrop-blur-md animate-fade-in">
  //         <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
  //           <NavLink
  //             to="/"
  //             onClick={() => setMobileMenuOpen(false)}
  //             className="block px-3 py-4 text-base font-medium border-b border-sand-100"
  //           >
  //             Home
  //           </NavLink>
  //           <NavLink
  //             to="/findRecipes"
  //             onClick={() => setMobileMenuOpen(false)}
  //             className="block px-3 py-4 text-base font-medium border-b border-sand-100"
  //           >
  //             Recipes
  //           </NavLink>
  //           {user && (
  //             <>
  //               <NavLink
  //                 to={`/userprofile/${user._id}`}
  //                 onClick={() => setMobileMenuOpen(false)}
  //                 className="block px-3 py-4 text-base font-medium border-b border-sand-100"
  //               >
  //                 My Profile
  //               </NavLink>
  //               <button
  //                 onClick={handleLogout}
  //                 className="block w-full text-left px-3 py-4 text-base font-medium border-b border-sand-100 text-red-500"
  //               >
  //                 Logout
  //               </button>
  //             </>
  //           )}
  //         </div>
  //       </div>
  //     )}
  //   </header>
  // );

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="font-serif text-2xl font-semibold tracking-tight text-foreground">
              <img src={logo} alt="Logo" className="h-12" />
            </Link>
          </div>
  
          {/* Desktop Menu */}
          <nav className="hidden md:flex space-x-8">
            <NavLink
              to="/"
              className={({ isActive }) => `transition-colors duration-200 font-medium ${
                isActive ? 'text-spice-500' : 'text-foreground/80 hover:text-foreground'
              }`}
            >
              Home
            </NavLink>
            <NavLink
              to="/findRecipes"
              className={({ isActive }) => `transition-colors duration-200 font-medium ${
                isActive ? 'text-spice-500' : 'text-foreground/80 hover:text-foreground'
              }`}
            >
              Recipes
            </NavLink>
          </nav>
  
          {/* Icons Section */}
          <div className="flex items-center space-x-6">
            {/* Search */}
            <div className="relative">
              <button
                onClick={toggleSearch}
                className={`p-2 rounded-full transition-colors ${
                  searchOpen ? 'bg-gray-200' : 'hover:bg-gray-100'
                }`}
                aria-label="Search"
              >
                <CiSearch className="h-5 w-5" />
              </button>
              {searchOpen && (
                <div className="absolute top-12 right-0 w-72 bg-white p-4 rounded-lg shadow-xl">
                  <NavSearchBox setSearchOpen={setSearchOpen} />
                </div>
              )}
            </div>
  
            {/* Profile */}
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setProfileMenuOpen(!isProfileMenuOpen)}
                className="btn btn-ghost btn-icon"
                aria-label="Profile"
              >
                <CgProfile className="w-5 h-5" />
              </button>
  
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2 animate-fade-in">
                  {user ? (
                    <>
                      <Link to={`/userprofile/${user._id}`} className="block px-4 py-2 hover:bg-sand-100 transition-colors">
                        My Profile
                      </Link>
                      <Link to="/my-recipes" className="block px-4 py-2 hover:bg-sand-100 transition-colors">
                        My Recipes
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 hover:bg-sand-100 transition-colors"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" className="block px-4 py-2 hover:bg-sand-100 transition-colors">
                        Login
                      </Link>
                      <Link to="/register" className="block px-4 py-2 hover:bg-sand-100 transition-colors">
                        Register
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
  
            {/* Saved Recipes */}
            <NavLink
              to="/savedRecipes"
              className={({ isActive }) => `btn btn-ghost btn-icon ${isActive ? 'text-spice-500' : ''}`}
            >
              <FaBookBookmark className="w-5 h-5" />
            </NavLink>
  
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              className="btn btn-ghost btn-icon md:hidden"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <IoMdClose className="w-5 h-5" /> : <IoMdMenu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
  
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md animate-fade-in">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            <NavLink
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-4 text-base font-medium border-b border-sand-100"
            >
              Home
            </NavLink>
            <NavLink
              to="/findRecipes"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-4 text-base font-medium border-b border-sand-100"
            >
              Recipes
            </NavLink>
            {user && (
              <>
                <NavLink
                  to={`/userprofile/${user._id}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-4 text-base font-medium border-b border-sand-100"
                >
                  My Profile
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-4 text-base font-medium border-b border-sand-100 text-red-500"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
  
};

export default NavBar;



