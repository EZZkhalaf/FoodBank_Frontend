import React from 'react';

const UserFollowModal = ({ users, onClose, title = "Users" }) => {
    console.log(users)
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg max-h-[80vh] overflow-y-auto">


        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">✕</button>
        </div>

        {/* User List */}
        <div className="space-y-4">
          {users.length > 0 ? (
            users.map((user) => (
              <div key={user._id} className="flex items-center gap-4">
                <img
                  src={user.profilePic || '/default.jpg'}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="text-gray-800 font-medium">{user.name}</span>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No users found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserFollowModal;
