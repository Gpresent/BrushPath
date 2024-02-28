import React, { useContext } from "react";
import "../styles/styles.css";
import Character from "../types/Character"; 
import { AuthContext } from "../utils/FirebaseContext";
import { addDoc, collection, connectFirestoreEmulator, getDocs, query, where } from "firebase/firestore";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";


const addCharacter = async (db:any) => {
    const characterRef = await addDoc(collection(db, "Character"), {
        //character_text: "Miguel",
        components: [""],
        hiragana: "",
        jlpt_level_n: 1,
        katakana: "",
        meaning: [""],
        number_of_strokes: 5,
        radical: "",
        similar_kanji: ""

      });
      console.log("Document written with ID: ", characterRef.id);
}

const getCharacters =async  (db:any) => {
    try {
        const characterRef = await collection(db,"Character");

        const q = query(characterRef, where('character_text', '!=', 'sam'))

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc:any) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        });

    
       
      } catch (error) {
        console.error('Error getting documents:', error);
        throw error;
      }
}

const signIn =async  (auth: any) => {
    try {
        
        await signInWithEmailAndPassword(auth,'zenjiapp@gmail.com','T4aleC4pst0ne!');
       
      } catch (error) {
        console.error('Error signing in:', error);
        throw error;
      }
}
const signUp =async  (auth: any) => {
    try {
        
        await createUserWithEmailAndPassword(auth,'zenjiapp@gmail.com','T4aleC4pst0ne!');
       
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
}
const localSignOut =async  (auth: any) => {
    try {
        await signOut(auth);
    
       
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
}




const SamButtons: React.FC = () => {
    const contextValue = useContext(AuthContext);
    
  return (
    <>
    <button onClick={() => {signIn((contextValue as any).auth)}}>Sign In</button>
    <button onClick={() => {localSignOut((contextValue as any).auth)}}>Sign Out</button>
    <button onClick={() => {signUp((contextValue as any).auth)}}>Sign Up</button>
    <button onClick={() => {console.log(contextValue)}}>User Info Log</button>
    <button onClick={() => {console.log(contextValue)}}>Add Character</button>
    
    <button onClick={() => {addCharacter((contextValue as any).db)}}>Add Character</button>
    <button onClick={() => {getCharacters((contextValue as any).db)}}>Get Characters</button>

    </>
  );
};

export default SamButtons;