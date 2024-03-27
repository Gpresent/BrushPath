import React, { Suspense, useContext, useEffect, useState } from "react";

import "../styles/styles.css";
import "../styles/dict.css";
import Character from "../types/Character";
import WordList from "../components/WordList";
import characterParser from "../utils/characterParser";
import app, { auth, db } from '../utils/Firebase'


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

// Example static data
const staticKanjiData: KanjiCharacter[] = [
  { id: '1', kanji: 'sam_is_awesome', meanings: ['water', 'fluid', 'liquid'] },
  { id: '2', kanji: '火', meanings: ['fire', 'flame', 'blaze'] },

  // Add more kanji characters as needed
];

const miniSearch = new MiniSearch({
  fields: ['kanji', 'meanings'], // Adjusted to match KanjiCharacter properties
  storeFields: ['kanji', 'meanings'], // Adjusted to match KanjiCharacter properties
  idField: 'id'
});

miniSearch.addAll(staticKanjiData);




const DictionaryView: React.FC<DictionaryProps> = ({ title }) => {
  const contextValue = db;

  // const [kanjiList, setkanjiList] = useState<Character[]>([]);
  // const [loading, setLoading] = useState<boolean>(true);
  const [kanjiList, setKanjiList] = useState<KanjiCharacter[]>(staticKanjiData);
  const [filteredKanjiList, setFilteredKanjiList] = useState<any[]>(staticKanjiData);
  const [loading, setLoading] = useState(false);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;

    if (query) {
      const results = miniSearch.search(query, { fuzzy: 2 });
      setFilteredKanjiList(results);
      console.log(results)
    } else {
      setFilteredKanjiList(kanjiList);
    }
  };

  // Logging kanjiList to console - can be removed after confirming it works
  useEffect(() => {
    console.log(kanjiList);
  }, [kanjiList]);


  return (
    <div className="dictionary-view">
      <p className="my-words">My Words</p>
      <input className="search-bar" onChange={handleSearch}
        placeholder="Search kanji..." />

      {JSON.stringify(filteredKanjiList)}
    </div>
  );
};


export default DictionaryView;
