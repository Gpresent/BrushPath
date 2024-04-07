import React, { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";

import "../styles/styles.css";
import "../styles/dict.css";

import WordList from "../components/WordList";
import characterParser from "../utils/characterParser";




import Loading from "../components/Loading";
import { CharacterSearchContext } from "../utils/CharacterSearchContext";
import LoadingBar from "../components/LoadingBar";
import Character from "../types/Character";
import { SearchResult } from "minisearch";
import { DocumentData } from "firebase/firestore";


interface SearchableCharacterListProps {
    selectable?: boolean;
    setSelectedKanji?: Dispatch<SetStateAction<Character[]>>;
    selectedKanji?: Character[];
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


const SearchableCharacterList: React.FC<SearchableCharacterListProps> = ({selectable, setSelectedKanji, selectedKanji}) => {

  const characterCache = useContext(CharacterSearchContext);
  const [filteredKanjiList, setFilteredKanjiList] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Add debounce delay in milliseconds
  const debounceDelay = 200;

  // Debounced search term
  const debouncedSearchTerm = useDebounce(searchTerm, debounceDelay);
  
  useEffect(() => {
    setLoading(true);
    console.log(debouncedSearchTerm)
    if (debouncedSearchTerm !== "") {
      
      
        const results = characterCache?.search?.search(debouncedSearchTerm, {
          boost: { unicode: 4, unicode_str: 4, one_word_meaning: 3, meanings: 2 },
          fuzzy: 2,
          prefix:true
        });
  
        const cleanResults = results?.filter((result) => result !== undefined && result !== null)
          .map((result) => characterParser(result)).filter((result) => result !== null && result !== undefined);
  
        setFilteredKanjiList(cleanResults ? cleanResults as Character[] : [] as Character[]);
      
      
    } else {
      const cleanResults = characterCache?.data?.filter(result => result !== undefined && result !== null)
        .map((result: DocumentData) => characterParser(result)).filter((result) => result !== null && result !== undefined);

      setFilteredKanjiList(cleanResults ? cleanResults as Character[] : [] as Character[]);
    }
    setLoading(false);
  }, [debouncedSearchTerm]);
  
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };


  useEffect(() => {
    setLoading(true);

      const cleanResults = characterCache?.data?.filter(result => result !== undefined && result !== null)
        .map((value: DocumentData) => characterParser(value)).filter((result) => result !== null && result !== undefined);

      setFilteredKanjiList(cleanResults ? cleanResults as Character[] : [] as Character[]);
    
    setLoading(false);
  }, []);

  


  return (
    <>
      {characterCache.search?.documentCount !== characterCache.numChars && characterCache.numChars != -1 &&
      <LoadingBar progress={characterCache.search?.documentCount || 0} duration={characterCache.numChars} message={"Indexing search..."} />
}
      <input className="search-bar" onChange={handleSearch}
        placeholder="Search kanji..." />
      {loading ? <Loading /> : <WordList words={filteredKanjiList} />}
    </>
  );
};


export default SearchableCharacterList;

