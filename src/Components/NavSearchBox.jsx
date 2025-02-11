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
        method: 'post',
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
      className="relative flex flex-col items-center bg-white border border-gray-300 rounded-lg shadow-md p-4 w-full max-w-2xl mt-8 sm:p-3"
    >
      {/* Search Bar */}
      <div className="flex w-full items-center bg-white border-b border-gray-300 pb-2 mb-4">
        <input
          type="text"
          placeholder="Search for Friends..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-3 outline-none bg-transparent text-gray-800 rounded-l-md"
        />
        <button type="submit" className="p-3 text-gray-600 hover:text-gray-900">
          <Search size={24} />
        </button>
        <button 
          onClick={() => setSearchOpen(false)}
          type="button" 
          className="p-3 text-gray-600 hover:text-gray-900"
        >
          <IoMdClose size={24} />
        </button>
      </div>

      {/* Display error message */}
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {/* Display loading message */}
      {loading && <p className="text-center mb-4">Loading...</p>}

      {/* Scrollable results */}
      {users.length > 0 && (
        <ul className="w-full max-h-64 overflow-y-auto space-y-2 border border-gray-200 p-2 rounded-md">
          {users.map((user) => (
            <UserElement key={user._id} user2={user} />
          ))}
        </ul>
      )}

      {/* No results message */}
      {users.length === 0 && !loading && !error && query.trim() && (
        <p className="text-center text-gray-500">No users found</p>
      )}
    </form>
  );
};

export default NavSearchBox;
