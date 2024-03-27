import React, { Suspense, useContext, useEffect, useState } from "react";

import "../styles/styles.css";
import "../styles/dict.css";
import Character from "../types/Character";
import WordList from "../components/WordList";
import characterParser from "../utils/characterParser";
import app, { auth, db } from '../utils/Firebase'
import { AuthContext } from "../utils/FirebaseContext";


import MiniSearch from 'minisearch'

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

interface KanjiCharacter {
  id: string; // Unique identifier for MiniSearch
  kanji: string;
  meanings: string[];
  // Add other properties as needed
}






const DictionaryView: React.FC<DictionaryProps> = ({ title }) => {
  const contextValue = db;

  const { characterCache } = useContext(AuthContext);
  const [kanjiList, setKanjiList] = useState<KanjiCharacter[]>([]);
  const [filteredKanjiList, setFilteredKanjiList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setLoading(true);


    if (query) {
      const results = characterCache?.search.search(query, { fuzzy: 1 });
      console.log(results);


      const cleanResults = results?.filter(result => result !== undefined && result !== null)
        .map((result: any) => characterParser(result)); //Could be faster?


      setFilteredKanjiList(cleanResults ? cleanResults : []);
      console.log(filteredKanjiList);
      // console.log(filteredKanjiList);
    } else {
      setFilteredKanjiList(kanjiList);
    }
    setLoading(false);
  };



  return (
    <div className="dictionary-view">
      <p className="my-words">My Words</p>
      <input className="search-bar" onChange={handleSearch}
        placeholder="Search kanji..." />

      {loading ? <Loading /> : <WordList words={filteredKanjiList} />}
    </div>
  );
};


export default DictionaryView;
