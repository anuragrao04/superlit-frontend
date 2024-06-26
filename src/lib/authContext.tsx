import React, { createContext, useContext, useState } from 'react';

// Define the context type 
interface AuthContextType {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  token: null,
  login: () => { },
  logout: () => { },
});

// Custom hook to access the context
export const useAuth = () => useContext(AuthContext);


export function AuthProvider({ children }: { children: React.ReactNode }) {


  const [token, setToken] = useState<string | null>(null);

  const login = (token: string) => {
    setToken(token);
  };

  const logout = () => {
    setToken(null);
  };


  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );

};
