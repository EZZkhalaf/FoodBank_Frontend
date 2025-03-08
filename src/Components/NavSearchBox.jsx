

import React, { useEffect, useState } from 'react';
import { IoMdClose } from "react-icons/io";
import { Search } from "lucide-react";
import UserElement from './userElement';

const NavSearchBox = ({ setSearchOpen }) => {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const delay = setTimeout(() => handleSearch(query), 500);
    return () => clearTimeout(delay);
  }, [query]);

  const handleSearch = async (searchedUser) => {
    if (!searchedUser.trim()) {
      setUsers([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3000/user/search', {
        method: 'get',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: searchedUser }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error fetching users');
      }

      if (data === 'no users found') {
        setUsers([]);
        setError('No users found');
      } else {
        setUsers(data);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError('Error fetching users');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="relative flex flex-col items-center bg-white border border-gray-300 rounded-xl shadow-lg p-5 w-full max-w-3xl mt-10 sm:p-4"
    >
      {/* Search Bar */}
      <div className="flex w-full items-center bg-gray-100 border border-gray-300 rounded-full p-2 shadow-sm">
        <input
          type="text"
          placeholder="Search for Friends..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-4 py-2 outline-none bg-transparent text-gray-800 text-lg rounded-full"
        />
        <button type="submit" className="p-2 text-gray-600 hover:text-gray-900">
          <Search size={24} />
        </button>
        <button 
          onClick={() => setSearchOpen(false)}
          type="button" 
          className="p-2 text-gray-600 hover:text-gray-900"
        >
          <IoMdClose size={24} />
        </button>
      </div>

      {/* Display error message */}
      {error && <p className="text-red-500 text-center mt-3">{error}</p>}

      {/* Display loading message */}
      {loading && <p className="text-center mt-3">Loading...</p>}

      {/* Scrollable results */}
      {users.length > 0 && (
        <ul className="w-full max-h-72 overflow-y-auto space-y-2 border border-gray-200 p-3 rounded-md bg-gray-50 mt-4">
          {users.map((user) => (
            <UserElement key={user._id} user2={user} />
          ))}
        </ul>
      )}

      {/* No results message */}
      {users.length === 0 && !loading && !error && query.trim() && (
        <p className="text-center text-gray-500 mt-4">No users found</p>
      )}
    </form>
  );
};

export default NavSearchBox;
