import app, { auth, db } from './Firebase'

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, User, NextOrObserver, GoogleAuthProvider } from "firebase/auth";

import React, { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';
import Login from '../pages/Login';
import Loading from '../components/Loading';
import { DocumentData, Timestamp, doc, runTransaction, getDoc, collection, getDocs } from 'firebase/firestore';



//Initialize Context
export const AuthContext = createContext<{ user: null | User, userData: null | DocumentData, getUserData: () => void, initalGetUserData: () => void }>({ user: null, userData: null, getUserData: () => { }, initalGetUserData: () => { } });

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
    setLoading(true);
    if (user === null || user.email === null) return;
    const userRef = doc(db, "User", user.email);
    try {
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        setUserData({ email: user.email, ...userDoc.data() });
        // console.log("Data fetched successfully", userDoc.data());
        if (userDoc.metadata.fromCache) {
          console.log("You are currently offline. The data might be outdated.");
        }
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);

    } finally {
      setLoading(false);
    }
  };



  const initalGetUserData = async () => {

    setLoading(true);
    try {
      await getUserData();
    } catch (error) {
      console.error("Initial data fetch error:", error);

    } finally {
      setLoading(false);
    }

  };


  const updateUserDatabase = async (user: any) => {
    try {
      const userRef = await doc(db, "User", user.email);
      await runTransaction(db, async (transaction) => {
        const userDoc = await transaction.get(userRef);
        if (!userDoc.exists()) {
          transaction.set(userRef, {
            admin: false,
            student: false,
            teacher: false,
            last_login_time: Timestamp.now(),
            decks: [
              doc(db, "Deck/JLPT_1"),
              doc(db, "Deck/JLPT_2"),
              doc(db, "Deck/JLPT_3"),
              doc(db, "Deck/JLPT_4"),
              doc(db, "Deck/JLPT_5")
            ],
            name: user.displayName,
            total_use_time: 0,
            last_deck_studied: doc(db, "Deck/JLPT_1")
          });
        }


        transaction.set(userRef, {
          admin: false,
          student: false,
          teacher: false,
          last_login_time: Timestamp.now(),
          decks: [doc(db, "Deck/JLPT_5"), doc(db, "Deck/JLPT_4"), doc(db, "Deck/JLPT_3"), doc(db, "Deck/JLPT_2"), doc(db, "Deck/JLPT_1")],
          name: user.displayName,
          total_use_time: 0,
          last_deck_studied: doc(db, "Deck/JLPT_5")
        });
        getUserData();

        //Add character_progress collection?
      });
      // console.log("Transaction successfully committed!");
      await getUserData(); // Fetch user data after updating
    } catch (e) {
      console.error("Transaction failed: ", e);
      throw e; // Re-throw to handle it in the caller
    }
  }
  // const characterCache = useIndexedDBCaching();
  // const MutexRunner = useMutex();
  // const mutex = new MutexRunner('caching');

  // const handleCacheAsync = async () => {
  //    mutex.lock();
  //   characterCache.startCache();
  //   mutex.unlock(); 
  // }

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


        // handleCacheAsync();
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);



  const value = {
    userData: userData,
    getUserData: getUserData,
    initalGetUserData: initalGetUserData,
    user: user,
  }

  return (<AuthContext.Provider value={value}>
    {loading ? <Loading /> : user ? children : <Login />}
  </AuthContext.Provider>)
}
