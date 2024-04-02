import app, { auth, db } from './Firebase'

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, User, NextOrObserver, GoogleAuthProvider } from "firebase/auth";

import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import Login from '../pages/Login';
import Loading from '../components/Loading';
import { Timestamp, doc, runTransaction } from 'firebase/firestore';


//Initialize Context
export const AuthContext = createContext<{ user: null | User }>({ user: null });

export const useAuth = () => {
  return useContext(AuthContext)
};

export const GoogleProvider = new GoogleAuthProvider();

export const AuthProvider = ({ children }: { children: ReactNode }) => {


  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const value = {

    user: user
  }

  const updateUserDatabase = async (user: any) => {
    try {
      const userRef = await doc(db, "User", user.email);
      await runTransaction(db, async (transaction) => {

        const userDoc = await transaction.get(userRef);
        if (userDoc.exists()) {
          throw "Document exists!";
        }


        transaction.set(userRef, {
          admin: false,
          student: false,
          teacher: false,
          last_login_time: Timestamp.now(),
          decks: [],
          name: user.displayName,
          total_use_time: 0,
        });

        //Add character_progress collection?
      });
      console.log("Transaction successfully committed!");
    } catch (e) {
      console.log("Transaction failed: ", e);
    }
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      // console.log("auth state changed")
      // console.log(firebaseUser);
      // console.log(auth)
      setLoading(true);
      setUser(firebaseUser);
      if (firebaseUser != null) {
        updateUserDatabase(firebaseUser);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (<AuthContext.Provider value={value}>
    {loading ? <Loading /> : user ? children : <Login />}
  </AuthContext.Provider>)
}

