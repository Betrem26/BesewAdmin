// // AuthContext.tsx
// import React, { createContext, useState, useContext } from 'react';

// interface User {
//   // Define your user interface
// }

// interface AuthContextType {
//   token: string | null;
//   user: User | null;
//   login: (token: string, userData: User) => void;
//   logout: () => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider: React.FC = ({ children }) => {
//   const [token, setToken] = useState<string | null>(null);
//   const [user, setUser] = useState<User | null>(null);

//   const login = (token: string, userData: User) => {
//     setToken(token);
//     setUser(userData);
//   };

//   const logout = () => {
//     setToken(null);
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ token, user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };
