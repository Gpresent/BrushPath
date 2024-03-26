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
  or,
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
    const q = query(characterRef, where('jlpt', '==', 'N4'), limit(30));

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

async function filterCharacters(input:string): Promise<any[]> {
  let toReturn: any = [];
  try {
    const characterRef = await collection(db, "Character");
    //Busted Firebase Way
    //Input can be literal exact, kun exact, on exact, meaning exact, or one_word_meaning prefix
    // const q = query(characterRef, or(where('literal', '==', input), where('kun','array-contains',input), where('on','array-contains',input), where('meanings','array-contains',input) ,or(where('one_word_meaning', '>=', input),
    // where('one_word_meaning', '<=', input+ '\uf8ff'))), limit(30));
    const q = query(characterRef, or(where('meanings','array-contains', input), where('literal','==',input)), limit(30));


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
  const [input, setInput] = useState<string>("");
  const handleInputChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setInput(event.target.value);
  };

  const handleSearch = (event: any) => {
    event.preventDefault();
    filterCharacters(input).then((filteredKanji) => setkanjiList(filteredKanji));
    
  };



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
        <button onClick={handleSearch}>Search</button>
        <input className="search-bar" value={input} onChange={handleInputChange}/>
      {loading? <Loading /> : <WordList words={kanjiList} />}
    </div>
  );
};


export default DictionaryView;
