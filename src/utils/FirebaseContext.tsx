import app, { auth, db } from './Firebase'

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, User, NextOrObserver } from "firebase/auth";

import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import Login from '../components/Login';



//Initialize Context
export const AuthContext = createContext({});

export const useAuth = () => {
    return useContext(AuthContext)
};

export const AuthProvider = ({children}: { children:ReactNode}) => {
    

    const [user, setUser] = useState<User | null>(null);
    const value = {
      
        user: user
    }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser ) => {
      setUser(firebaseUser);
    });

    return unsubscribe;
  }, []);
      
    return (<AuthContext.Provider value={value}>

        {user? children: <Login />}
    </AuthContext.Provider>)
}

