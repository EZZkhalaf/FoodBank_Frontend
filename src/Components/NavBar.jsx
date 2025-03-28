

// import React, { useEffect, useState, useCallback, useRef } from "react";
// import { Link, NavLink } from "react-router-dom";
// import { Search } from "lucide-react";
// import { CgProfile } from "react-icons/cg";
// import { FaBookBookmark } from "react-icons/fa6";
// import { IoMdClose, IoMdMenu } from "react-icons/io";
// import UserElement from "./userElement";
// import logo from "../assets/logo.png";
// import { useAuthContext } from "../Context/AuthContext";

// const NavBar = () => {
//   const [query, setQuery] = useState("");
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
//   const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [isScrolled, setIsScrolled] = useState(false);
//   const profileMenuRef = useRef(null);
//   const {user} = useAuthContext();
//    console.log(user)
//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 0);
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const handleSearch = useCallback(async (searchedUser) => {
//     if (!searchedUser.trim()) return setUsers([]);

//     setLoading(true);
//     setError(null);

//     try {
//       const response = await fetch("http://localhost:3000/user/search", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ username: searchedUser }),
//       });

//       const data = await response.json();
//       setUsers(data === "no users found" ? [] : data);
//     } catch (error) {
//       console.error("Error fetching users:", error);
//       setError("Failed to fetch users. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     const delay = setTimeout(() => handleSearch(query), 500);
//     return () => clearTimeout(delay);
//   }, [query, handleSearch]);

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
//         setProfileMenuOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//         <header
//           className={`fixed top-0 left-0 right-0  z-50 transition-all duration-300 ${
//             isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-gray-100"
//           }`}
//         >
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
//             <div className="flex items-center justify-between h-16">
//               <div className="flex-shrink-0">
//                 <Link to="/" className="font-serif text-2xl font-semibold tracking-tight text-foreground">
//                   <img src={logo} alt="Logo" className="h-12" />
//                 </Link>
//               </div>

//               <div className="flex items-center justify-center space-x-6 w-[20vw]">
//                 <div className="hidden md:flex items-center">
//                   <form onSubmit={(e) => e.preventDefault()} className="w-[20vw]">
//                     <div className="relative">
//                       <input
//                         type="text"
//                         placeholder="Search for Friends..."
//                         value={query}
//                         onChange={(e) => setQuery(e.target.value)}
//                         className=" pl-4 pr-10 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-spice-500 focus:border-transparent text-sm text-gray-800 bg-white placeholder-gray-400"
//                       />
//                     </div>
//                     {query.trim() && (
//                       <div className="absolute mt-2 w-48 bg-white rounded-lg shadow-lg max-h-72 overflow-y-auto z-50">
//                         {loading && <p className="text-center text-gray-500 text-xs p-2">Loading...</p>}
//                         {error && <p className="text-red-500 text-xs text-center p-2">{error}</p>}
//                         {users.length > 0 ? (
//                           <ul className="space-y-2 p-2 mx-4 w-full">
//                             {users.map((user) => (
//                               <UserElement key={user._id} user2={user} />
//                             ))}
//                           </ul>
//                         ) : (
//                           !loading && <p className="text-center text-gray-500 text-xs p-2">No users found</p>
//                         )}
//                       </div>
//                     )}
//                   </form>
//                 </div>

//                 <Link to={`/userprofile/${user._id}`} className="block px-4 py-2 hover:bg-sand-100 transition-colors ">
//                   <div className="relative" ref={profileMenuRef}>
//                         <button
//                           onClick={() => setProfileMenuOpen(!isProfileMenuOpen)}
//                           className="btn btn-ghost btn-icon"
//                           aria-label="Profile"
//                         >
//                           <CgProfile className="w-5 h-5" />
//                         </button>
//                       </div>
//                 </Link>

            




//                 <NavLink
//                   to="/savedRecipes"
//                   className={({ isActive }) => `btn btn-ghost btn-icon mr-7 ${isActive ? "text-spice-500" : ""}`}
//                 >
//                   <FaBookBookmark className="w-5 h-5" />
//                 </NavLink>

//                 <button
//                   onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
//                   className="btn btn-ghost btn-icon md:hidden"
//                   aria-label="Menu"
//                 >
//                   {isMobileMenuOpen ? <IoMdClose className="w-5 h-5" /> : <IoMdMenu className="w-5 h-5" />}
//                 </button>
//               </div>
//             </div>
//             {isMobileMenuOpen && (
              
//               <div className="md:hidden flex flex-col justify-center items-center bg-white shadow-md py-4">
//                         <NavLink to="/userprofile" className="py-2">Profile</NavLink>
//                         <NavLink to="/savedRecipes" className="py-2">Saved Recipes</NavLink>
//                 <form onSubmit={(e) => e.preventDefault()} className="w-[90%] mt-6">
//                 <form onSubmit={(e) => e.preventDefault()} className="flex justify-center">
//                     <div className="w-full flex justify-center mb-4">
//                       <input
//                         type="text"
//                         placeholder="Search for Friends..."
//                         value={query}
//                         onChange={(e) => setQuery(e.target.value)}
//                         className=" pl-4 pr-10 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-spice-500 focus:border-transparent text-sm text-gray-800 bg-white placeholder-gray-400"
//                       />
//                     </div>
//                     {query.trim() && (
//                       <div className="absolute w-48 bg-white rounded-lg shadow-lg max-h-72 overflow-y-auto z-50 mt-10">
//                         {loading && <p className="text-center text-gray-500 text-xs p-2">Loading...</p>}
//                         {error && <p className="text-red-500 text-xs text-center p-2">{error}</p>}
//                         {users.length > 0 ? (
//                           <ul className="space-y-2 p-2 mx-4 w-full">
//                             {users.map((user) => (
//                               <UserElement key={user._id} user2={user} />
//                             ))}
//                           </ul>
//                         ) : (
//                           !loading && <p className="text-center text-gray-500 text-xs p-2">No users found</p>
//                         )}
//                       </div>
//                     )}
//                   </form>
//                 </form>
//               </div>
//             )}
//           </div>
//         </header>
//   );
// };

// export default NavBar;



import React, { useEffect, useState, useCallback, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import { Search } from "lucide-react";
import { CgProfile } from "react-icons/cg";
import { FaBookBookmark } from "react-icons/fa6";
import { IoMdClose, IoMdMenu } from "react-icons/io";
import UserElement from "./userElement";
import logo from "../assets/logo.png";
import { useAuthContext } from "../Context/AuthContext";

const NavBar = () => {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const profileMenuRef = useRef(null);
  const { user, dispatch } = useAuthContext();

  // const handleLogout = () => {
  //   logout();
  //   setProfileMenuOpen(false);
  // };


  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch({ type: "logout" });
    navigate("/login");
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = useCallback(async (searchedUser) => {
    if (!searchedUser.trim()) return setUsers([]);

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:3000/user/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: searchedUser }),
      });

      const data = await response.json();
      setUsers(data === "no users found" ? [] : data);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to fetch users. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => handleSearch(query), 500);
    return () => clearTimeout(delay);
  }, [query, handleSearch]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-gray-100"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="font-serif text-2xl font-semibold tracking-tight text-foreground">
              <img src={logo} alt="Logo" className="h-12" />
            </Link>
          </div>

          <div className="flex items-center justify-center space-x-6 w-[20vw]">
            <div className="hidden md:flex items-center">
              <form onSubmit={(e) => e.preventDefault()} className="w-[20vw]">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search for Friends..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pl-4 pr-10 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-spice-500 focus:border-transparent text-sm text-gray-800 bg-white placeholder-gray-400"
                  />
                  {query.trim() && (
                    <div className="absolute mt-2 w-full bg-white rounded-lg shadow-lg max-h-72 overflow-y-auto z-50">
                      {loading && <p className="text-center text-gray-500 text-xs p-2">Loading...</p>}
                      {error && <p className="text-red-500 text-xs text-center p-2">{error}</p>}
                      {users.length > 0 ? (
                        <ul className="space-y-2 p-2">
                          {users.map((user) => (
                            <UserElement key={user._id} user2={user} />
                          ))}
                        </ul>
                      ) : (
                        !loading && <p className="text-center text-gray-500 text-xs p-2">No users found</p>
                      )}
                    </div>
                  )}
                </div>
              </form>
            </div>

            <div className="hidden md:block relative" ref={profileMenuRef}>
              <button
                onClick={() => setProfileMenuOpen(!isProfileMenuOpen)}
                className="btn btn-ghost btn-icon"
                aria-label="Profile"
              >
                <CgProfile className="w-6 h-6" />
              </button>
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                  <Link
                    to={`/userprofile/${user._id}`}
                    className="block px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                    onClick={() => setProfileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

            <NavLink
              to="/savedRecipes"
              className={({ isActive }) => `hidden md:block btn btn-ghost btn-icon ${isActive ? "text-spice-500" : ""}`}
            >
              <FaBookBookmark className="w-6 h-6" />
            </NavLink>

            <button
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              className="btn btn-ghost btn-icon md:hidden"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <IoMdClose className="w-6 h-6" /> : <IoMdMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden flex flex-col items-center bg-white shadow-md py-4 space-y-3">
            <NavLink
              to={`/userprofile/${user._id}`}
              className="px-4 py-2 text-gray-700 hover:text-spice-500"
              onClick={() => setMobileMenuOpen(false)}
            >
              Profile
            </NavLink>
            <NavLink
              to="/savedRecipes"
              className="px-4 py-2 text-gray-700 hover:text-spice-500"
              onClick={() => setMobileMenuOpen(false)}
            >
              Saved Recipes
            </NavLink>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-gray-700 hover:text-spice-500"
            >
              Logout
            </button>

            <form onSubmit={(e) => e.preventDefault()} className="w-[90%] mt-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for Friends..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-4 pr-10 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-spice-500 focus:border-transparent text-sm text-gray-800 bg-white placeholder-gray-400"
                />
                {query.trim() && (
                  <div className="absolute mt-2 w-full bg-white rounded-lg shadow-lg max-h-72 overflow-y-auto z-50">
                    {loading && <p className="text-center text-gray-500 text-xs p-2">Loading...</p>}
                    {error && <p className="text-red-500 text-xs text-center p-2">{error}</p>}
                    {users.length > 0 ? (
                      <ul className="space-y-2 p-2">
                        {users.map((user) => (
                          <UserElement key={user._id} user2={user} />
                        ))}
                      </ul>
                    ) : (
                      !loading && <p className="text-center text-gray-500 text-xs p-2">No users found</p>
                    )}
                  </div>
                )}
              </div>
            </form>
          </div>
        )}
      </div>
    </header>
  );
};

export default NavBar;