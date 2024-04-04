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
import { CharacterSearchContext } from "../utils/CharacterSearchContext";
import LoadingBar from "../components/LoadingBar";

interface DictionaryProps {
  title: string;
}

interface KanjiCharacter {
  id: string; // Unique identifier for MiniSearch
  kanji: string;
  meanings: string[];
  // Add other properties as needed
}



// Debounce hook
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}


const DictionaryView: React.FC<DictionaryProps> = ({ title }) => {
  const contextValue = db;

  const characterCache = useContext(CharacterSearchContext);
  const [kanjiList, setKanjiList] = useState<KanjiCharacter[]>([]);
  const [filteredKanjiList, setFilteredKanjiList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Add debounce delay in milliseconds
  const debounceDelay = 300;

  // Debounced search term
  const debouncedSearchTerm = useDebounce(searchTerm, debounceDelay);

  useEffect(() => {
    setLoading(true);
    if (debouncedSearchTerm) {
      const results = characterCache?.search?.search(debouncedSearchTerm, {
        boost: { unicode: 4, unicode_str: 4, one_word_meaning: 3, meanings: 2 },
        fuzzy: 2,
        prefix:true
      });

      const cleanResults = results?.filter(result => result !== undefined && result !== null)
        .map((result: any) => characterParser(result));

      setFilteredKanjiList(cleanResults ? cleanResults : []);
    } else {
      setFilteredKanjiList(kanjiList);
    }
    setLoading(false);
  }, [debouncedSearchTerm]);
  
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };


  useEffect(() => {
    setLoading(true);
      const results = characterCache?.search?.search("a", {
        boost: { unicode: 4, unicode_str: 4, one_word_meaning: 3, meanings: 2 },
        fuzzy: 2,
        prefix:true
      });

      const cleanResults = results?.filter(result => result !== undefined && result !== null)
        .map((result: any) => characterParser(result));

      setFilteredKanjiList(cleanResults ? cleanResults : []);
    
    setLoading(false);
  }, []);


  return (
    <div className="dictionary-view">
      <p className="my-words">Dictionary</p>
      {characterCache.search?.documentCount !== 2136 &&
      <LoadingBar progress={characterCache.search?.documentCount || 0} duration={2136} message={"Indexing search..."} />
}
      <input className="search-bar" onChange={handleSearch}
        placeholder="Search kanji..." />
      {loading ? <Loading /> : <WordList words={filteredKanjiList} />}
    </div>
  );
};


export default DictionaryView;
