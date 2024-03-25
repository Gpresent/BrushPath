import React, { Suspense, useContext, useEffect, useState } from "react";
import "../styles/styles.css";
import "../styles/dict.css";
import Character from "../types/Character";
import WordList from "./WordList";
import characterParser from "../utils/characterParser";
import app, { auth, db } from '../utils/Firebase'

import {
  collection,
  getDocs,
  limit,
  query,
  where,
} from "firebase/firestore";
import Loading from "./Loading";

interface DictionaryProps {
  title: string;
}

async function getCharacters(db: any): Promise<any[]> {
  let toReturn: any = [{}];

  try {
    const characterRef = await collection(db, "Character");
    const q = query(characterRef);

    const querySnapshot = await getDocs(q);
    const convertedCharacters: Character[] = [];

    querySnapshot.forEach((doc: any) => {
      let character = characterParser(doc.data());

      toReturn.push({kanji: character.unicode, meanings: character.english});
    });
    console.log(toReturn);
    return toReturn;
  } catch (error) {
    console.error("Error getting documents:", error);
    throw error;
  }
}

const GetCharacterMeanings: React.FC = () => {
  const contextValue = db;

  // useEffect(() => {
  //   const populateList = async () => {

  //     await getCharacters(contextValue);

  //   };
  //   populateList();
  // }, []);
    return (
      <>
      <div>
        hello bro
      </div>
      </>
    );
  };
  
  export default GetCharacterMeanings;