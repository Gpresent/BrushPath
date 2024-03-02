import {initializeApp}  from "firebase/app";

import { getAnalytics } from "firebase/analytics";

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

import React, { createContext } from 'react';
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {

  apiKey: "AIzaSyD6UNA2liqzgCkt4vWUi600Gfbs4GWIpw4",

  authDomain: "zenji-1e015.firebaseapp.com",

  projectId: "zenji-1e015",

  storageBucket: "zenji-1e015.appspot.com",

  messagingSenderId: "703184918088",

  appId: "1:703184918088:web:22574b6beddfcc3e276a7d",

  measurementId: "G-QX9F8XPZN1"

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const auth = getAuth(app);

export default app;

