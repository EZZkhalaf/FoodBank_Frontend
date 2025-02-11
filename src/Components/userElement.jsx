import React, { useState } from "react";
import { IoPersonAdd } from "react-icons/io5";
import { useAuthContext } from "../Context/AuthContext";


const UserElement = ({ user2 }) => {
  const [loading , setloading] = useState(false);
  const {user} = useAuthContext();
  const followUser = async() => {
    setloading(true);
    try {
        const response = await fetch('http://localhost:3000/user/follow' , {
          method:'post',
          headers : {'Content-Type' : 'application/json'},
          body: JSON.stringify({
            currentuserid : user._id , 
            followinguserid : user2._id
          })
        });
        const data = response.json();
        console.log(data)
    } catch (err) {
        console.log(err)
    }
  }

  return (
    <div className="flex items-center justify-between p-2 border-b border-gray-200 w-full">
      <div className="flex items-center">
        <img
          src={user2.profilePicture || 'default-profile.jpg'}
          alt={`${user2.username}'s profile`}
          className="w-10 h-10 rounded-full object-cover mr-2"
        />
        <span className="font-semibold text-gray-800">{user2.username}</span>
      </div>
      <h1>111</h1>
      <IoPersonAdd 
        onClick={followUser}
        className="text-xl text-blue-500 cursor-pointer hover:text-blue-700" />
    </div>
  );
};


export default UserElement;