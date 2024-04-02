import app, { auth, db } from './Firebase'

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, User, NextOrObserver, GoogleAuthProvider } from "firebase/auth";

import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import Login from '../pages/Login';
import Loading from '../components/Loading';
import { DocumentData, Timestamp, doc, runTransaction, getDoc, collection, getDocs } from 'firebase/firestore';
import useIndexedDBCaching, { IndexedDBCachingResult } from './useIndexedDBCaching';
import { useMutex } from 'react-context-mutex';


//Initialize Context
export const AuthContext = createContext<{ user: null | User, userData: null | DocumentData, getUserData: () => void, characterCache: IndexedDBCachingResult | null }>
  ({ user: null, userData: null, getUserData: () => { }, characterCache: null });

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

  const getUserData = async () => {
    if (user === null || user.email === null) return;
    const userRef = doc(db, "User", user.email);
    try {
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        setUserData({ email: user.email, ...userDoc.data() });
        console.log("Data fetched successfully", userDoc.data());
        if (userDoc.metadata.fromCache) {
          console.log("You are currently offline. The data might be outdated.");
        }
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);

    }
  };



  const updateUserDatabase = async (user: any) => {
    try {
      const userRef = await doc(db, "User", user.email);
      await runTransaction(db, async (transaction) => {

        const userDoc = await transaction.get(userRef);
        if (userDoc.exists()) {
          getUserData();
          return;
        }


        transaction.set(userRef, {
          admin: false,
          student: false,
          teacher: false,
          last_login_time: Timestamp.now(),
          decks: [doc(db, "Deck/JLPT_1"), doc(db, "Deck/JLPT_2"), doc(db, "Deck/JLPT_3"), doc(db, "Deck/JLPT_4"), doc(db, "Deck/JLPT_5")],
          name: user.displayName,
          total_use_time: 0,
          last_deck_studied: doc(db, "Deck/JLPT_1")
        });
        getUserData();

        //Add character_progress collection?
      });
      console.log("Transaction successfully committed!");
    } catch (e) {
      console.log("Transaction failed: ", e);
    }
  }
  const characterCache = useIndexedDBCaching();
  const MutexRunner = useMutex();
  const mutex = new MutexRunner('caching');

  const handleCacheAsync = async () => { mutex.lock();
    characterCache.startCache();
    mutex.unlock(); }

  useEffect(() => {
    // characterCache.startCache();
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      // console.log("auth state changed")
      // console.log(firebaseUser);
      // console.log(auth)
      setLoading(true);
      setUser(firebaseUser);
      if (firebaseUser != null) {
        updateUserDatabase(firebaseUser);
        handleCacheAsync();
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);



  const value = {
    userData: userData,
    getUserData: getUserData,
    user: user,
    characterCache: characterCache,
  }

  return (<AuthContext.Provider value={value}>
    {loading ? <Loading /> : user ? children : <Login />}
  </AuthContext.Provider>)
}
