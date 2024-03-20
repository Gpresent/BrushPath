import app, { auth, db } from './Firebase'

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, User, NextOrObserver, GoogleAuthProvider } from "firebase/auth";

import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import Login from '../pages/Login';
import Loading from '../components/Loading';
import { DocumentData, Timestamp, doc, runTransaction } from 'firebase/firestore';


//Initialize Context
export const AuthContext = createContext<{user: null| User, userData: null| DocumentData , getUserData: () => void}>({user: null,userData: null , getUserData: () => {}});

export const useAuth = () => {
    return useContext(AuthContext)
};

export const GoogleProvider = new GoogleAuthProvider();

export const AuthProvider = ({children}: { children:ReactNode}) => {
    

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [userData, setUserData] = useState<any>(null);

    
    
    const getUserData = async () => {
      if(user === null || user.email === null) {
        return;
      }
      try {
        const userRef = await doc(db, "User", user.email);
        await runTransaction(db, async (transaction) => {
          
          const userDoc = await transaction.get(userRef);
          if (!userDoc.exists()) {
            throw "Document doesn't exists!";
          }
          setUserData(userDoc.data()); 
          console.log(userDoc.data());          
        });

        console.log("Transaction successfully committed!");
        
        
      } catch (e) {
        console.log("Transaction failed: ", e);
      }
    }

    const value = {
      userData: userData,
      getUserData: getUserData,
      user: user
  }

    const updateUserDatabase = async (user:any) => {
      try {
        const userRef = await doc(db,"User",user.email);
        await runTransaction(db, async (transaction) => {
          
          const userDoc = await transaction.get(userRef);
          if (userDoc.exists()) {
            getUserData();
            throw "Document exists!";
            
          }
      
          
          transaction.set(userRef, {
            admin: false,
            student: false,
            teacher: false,
            last_login_time: Timestamp.now(),
            decks:[doc(db,"Deck/JLPT_1"), doc(db,"Deck/JLPT_2"), doc(db,"Deck/JLPT_3"), doc(db,"Deck/JLPT_4"), doc(db,"Deck/JLPT_5")],
            name: user.displayName,
            total_use_time: 0,
          });
          getUserData();
          
          //Add character_progress collection?
        });
        console.log("Transaction successfully committed!");
      } catch (e) {
        console.log("Transaction failed: ", e);
      }
    }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      console.log("auth state changed")
      console.log(firebaseUser);
      console.log(auth)
      setLoading(true);
      setUser(firebaseUser);
      if(firebaseUser != null) {
        updateUserDatabase(firebaseUser);
        
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);
      
    return (<AuthContext.Provider value={value}>
        {loading? <Loading /> : user? children: <Login />}
    </AuthContext.Provider>)
}

