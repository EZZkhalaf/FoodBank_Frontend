
import React, { useState } from "react";
import { IoPersonAdd } from "react-icons/io5";
import { useAuthContext } from "../Context/AuthContext";
import { IoMdDoneAll } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";

const UserElement = ({ user2 }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuthContext();
  const [successfullyAdded, setAdded] = useState(false);

  const followUser = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/user/follow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentuserid: user._id,
          followinguserid: user2._id,
        }),
      });

      const data = await response.json();
      setAdded(true);
      toast.success("User added successfully.");
     
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      
    }
  };

  return (
    <div 
      // onClick={}
      className="flex items-center justify-between p-3 border-b border-gray-200 w-full bg-gray-100 rounded-md shadow-md">
        <div className="flex items-center">
          <img
            src={user2.profilePicture || "default-profile.jpg"}
            alt={`${user2.username}'s profile`}
            className="w-10 h-10 rounded-full object-cover mr-3"
          />
          <span className="font-semibold text-gray-800">{user2.username}</span>
        </div>

        {successfullyAdded ? (
          <></>
        ) : (
          <IoPersonAdd
            onClick={followUser}
            className={`text-2xl cursor-pointer ${
              loading ? "text-gray-400 cursor-not-allowed" : "text-blue-500 hover:text-blue-700"
            }`}
            disabled={loading}
          />
        )}
    </div>
  );
};

export default UserElement;
