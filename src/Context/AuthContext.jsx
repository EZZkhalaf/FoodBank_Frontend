import React, { createContext, useContext, useReducer } from 'react';

// Initial state for authentication
const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
};

// Reducer function to handle actions
const authReducer = (state, action) => {
  switch (action.type) {
    case 'login':
      return { ...state, user: action.payload };
    case 'logout':
      return { ...state, user: null };
    case 'SET_USER':
      return { ...state,  user: action.payload};
    default:
      return state;
  }
};

// Create context
export const AuthContext = createContext();  // Ensure it's exported

// Custom hook to use the AuthContext
export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }

  return context;
};

// AuthProvider component to wrap the app with context
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  return (
    <AuthContext.Provider value={{ user: state.user, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
