import app, { auth, db } from './Firebase'

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, User, NextOrObserver } from "firebase/auth";

import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import Login from '../pages/Login';
import Loading from '../components/Loading';



//Initialize Context
export const AuthContext = createContext<{user: null| User}>({user: null});

export const useAuth = () => {
    return useContext(AuthContext)
};

export const AuthProvider = ({children}: { children:ReactNode}) => {
    

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const value = {
      
        user: user
    }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser ) => {
      setLoading(true);
      setUser(firebaseUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);
      
    return (<AuthContext.Provider value={value}>

        {loading? <Loading /> : user? children: <Login />}
    </AuthContext.Provider>)
}

