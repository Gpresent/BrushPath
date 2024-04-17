import app, { auth, db } from './Firebase'

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, User, NextOrObserver, GoogleAuthProvider } from "firebase/auth";
import { DecksProvider } from './DeckContext';  // Import DecksProvider
import React, { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';
import Login from '../pages/Login';
import Loading from '../components/Loading';
import { DocumentData, Timestamp, doc, runTransaction, getDoc, collection, getDocs } from 'firebase/firestore';



//Initialize Context
export const AuthContext = createContext<{ user: null | User, userData: null | DocumentData, getUserData: (currentUser: User) => void, }>
  ({ user: null, userData: null, getUserData: (currentUser: User) => { }, });


export const useAuth = () => {
  return useContext(AuthContext)
};

export const GoogleProvider = new GoogleAuthProvider();
GoogleProvider.setCustomParameters({
  prompt: 'select_account'
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {


  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [userData, setUserData] = useState<any>(null);

  const getUserData = async (currentUser: User) => {
    setLoading(true);

    if (currentUser === null || currentUser.email === null) return;

    const userRef = doc(db, "User", currentUser.email);
    try {
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {

        setUserData({ email: currentUser.email, ...userDoc.data() });

        // console.log("Data fetched successfully", userDoc.data());
        if (userDoc.metadata.fromCache) {
          console.log("You are currently offline. The data might be outdated.");
        }
      } else {
        console.log("User document not found!");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);

    } finally {
      setLoading(false);
    }
  };


  const updateUserDatabase = async (currentUser: any) => {
    try {
      const userRef = await doc(db, "User", currentUser.email);

      await runTransaction(db, async (transaction) => {

        const userDoc = await transaction.get(userRef);

        if (!userDoc.exists()) {
          transaction.set(userRef, {
            admin: false,
            student: false,
            teacher: false,
            last_login_time: Timestamp.now(),
            decks: [doc(db, "Deck/JLPT_5"), doc(db, "Deck/JLPT_4"), doc(db, "Deck/JLPT_3"), doc(db, "Deck/JLPT_2"), doc(db, "Deck/JLPT_1")],
            name: currentUser.displayName,
            total_use_time: 0,
            last_deck_studied: doc(db, "Deck/JLPT_5")
          });
          await getUserData(currentUser);
        } else {

          transaction.update(userRef, {
            last_login_time: Timestamp.now(),
          });
        }
      });

      await getUserData(currentUser);
    } catch (e) {
      console.error("Transaction failed: ", e);
      throw e;
    }
  }


  useEffect(() => {
    // characterCache.startCache();
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {

      setLoading(true);
      setUser(firebaseUser);

      if (firebaseUser != null) {

        updateUserDatabase(firebaseUser);
        // handleCacheAsync(); debugger;
        getUserData(firebaseUser);
      }

      setLoading(false);
    });


    return unsubscribe;
  }, []);



  const value = {
    userData: userData,
    getUserData: getUserData,
    user: user,
  }


  // debugger;
  return (<AuthContext.Provider value={value}>
    {loading ? <Loading /> : user ? (
      <DecksProvider>
        {children}
      </DecksProvider>
    ) : <Login />}
  </AuthContext.Provider>)
}
