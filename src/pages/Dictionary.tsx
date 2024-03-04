import React, { Suspense, useContext, useEffect, useState } from "react";
import "../styles/styles.css";
import "../styles/dict.css";
import Character from "../types/Character";
import WordList from "../components/WordList";
import characterParser from "../utils/characterParser";
import app, { auth, db } from '../utils/Firebase'

import {
  collection,
  getDocs,
  limit,
  query,
  where,
} from "firebase/firestore";
import Loading from "../components/Loading";

interface DictionaryProps {
  title: string;
}

async function getCharacters(db: any): Promise<any[]> {
  let toReturn: any = [];
  try {
    const characterRef = await collection(db, "Character");
    const q = query(characterRef, where('jlpt', '==', '4'), limit(30));

    const querySnapshot = await getDocs(q);
    const convertedCharacters: Character[] = [];

    querySnapshot.forEach((doc: any) => {
      toReturn.push(characterParser(doc.data()));
    });
    return toReturn;
  } catch (error) {
    console.error("Error getting documents:", error);
    throw error;
  }
}

const DictionaryView: React.FC<DictionaryProps> = ({ title }) => {
  const contextValue = db;

  const [kanjiList, setkanjiList] = useState<Character[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const populateList = async () => {
      setLoading(true);
      setkanjiList(await getCharacters(contextValue));
      setLoading(false);
    };
    populateList();
  }, []);

  return (
    <div className="dictionary-view">
      <p className="my-words">My Words</p>
      <input className="search-bar" />
      {loading? <Loading /> : <WordList words={kanjiList} />}
    </div>
  );
};


export default DictionaryView;
