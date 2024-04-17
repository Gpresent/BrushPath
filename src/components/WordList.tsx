import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import WordCard from "./WordCard";
import Character from "../types/Character";
import MiniSearch from "minisearch";
import characterParser from "../utils/characterParser";


interface WordListProps {
  words: Character[];
  selectedWords?: Character[];
  setSelectedWords?: Dispatch<SetStateAction<Character[]>>;
  selectable?: boolean;
  style?:  React.CSSProperties;
}

var search: MiniSearch<any> = new MiniSearch({
  fields: [
    "on",
    "unicode_str",
    "one_word_meaning",
    "compounds",
    "literal",
    "meanings",
    "parts",
    "nanori",
    "kun",
  ], // fields to index for full-text search
  storeFields: [
    "id",
    "_id",
    "on",
    "unicode",
    "stroke_count",
    "unicode_str",
    "one_word_meaning",
    "compounds",
    "jlpt",
    "freq",
    "codepoints",
    "totalLengths",
    "grade",
    "literal",
    "readings",
    "meanings",
    "parts",
    "nanori",
    "meanings_str",
    "kun",
    "coords",
    "radicals",
    "english",
  ], // fields to return with search results
});

function useDebounce(value: any, delay: number) {
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

const WordList: React.FC<WordListProps> = ({
  words,
  selectedWords,
  selectable,
  setSelectedWords,
  style
}) => {
  const [filteredKanjiList, setFilteredKanjiList] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [memoizedWordList, setMemoizedWordList] = useState([]);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (memoizedWordList.length !== words.length) {
      setMemoizedWordList(words as any);
    }
  }, [words, memoizedWordList]);

  useMemo(() => {
    search.removeAll();
    search.addAll(
      memoizedWordList.filter(
        (elem) => elem != null && !search.has((elem as any).id)
      )
    );
  }, [memoizedWordList]);

  // Add debounce delay in milliseconds
  const debounceDelay = 200;

  // Debounced search term
  const debouncedSearchTerm = useDebounce(searchTerm, debounceDelay);

  useEffect(() => {
    setLoading(true);
    // console.log(debouncedSearchTerm);
    if (debouncedSearchTerm !== "") {
      const results = search.search(debouncedSearchTerm, {
        boost: { unicode: 3, unicode_str: 2, one_word_meaning: 20, meanings: 5 },
        fuzzy: 2,
        prefix: true,
      });

      const cleanResults = results
        ?.filter((result) => result !== undefined && result !== null)
        .map((result) => characterParser(result))
        .filter((result) => result !== null && result !== undefined);

      setFilteredKanjiList(
        cleanResults ? (cleanResults as Character[]) : ([] as Character[])
      );

      // console.log(results)
      if (!results.length) {
        setNotFound(true);
      } else {
        setNotFound(false);
      }
    } else {
      setNotFound(false);
      setFilteredKanjiList([]);
    }

    setLoading(false);
  }, [debouncedSearchTerm]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const modifiedWords = useMemo(() => {
    // console.log("words");
    if (selectedWords === null) {
      return words;
    }
    return words.map((word) => {
      const selected = selectedWords?.find(
        (selectedWord) => selectedWord.unicode === word.unicode
      )
        ? true
        : false;
      return { ...word, selected };
    });
  }, [selectedWords]);

  const handleClick = (selectedCharacter: Character) => {
    // console.log("Selected ", selectedCharacter);
    if (setSelectedWords && selectedWords) {
      //If it is selected, remove it
      if (selectedCharacter.selected) {
        setSelectedWords(
          selectedWords.filter(
            (char) => char.unicode !== selectedCharacter.unicode
          )
        );
      } else {
        setSelectedWords([...selectedWords, selectedCharacter]);
      }
    }
  };

  return (
    <>
    
      <input
        className="search-bar"
        onChange={handleSearch}
        placeholder="Search kanji..."
      />
     
      <div style={style} className="word-list">
        {notFound ? (
          <div className="not-found">No Results</div>
        ) : (
          <>
            {filteredKanjiList.length > 0
              ? filteredKanjiList.map((word) => (
                  <WordCard
                    key={word.unicode}
                    character={word}
                    selectable={selectable}
                    handleClick={handleClick}
                  />
                ))
              : words.map((word) => (
                  <WordCard
                    key={word.unicode}
                    character={word}
                    selectable={selectable}
                    handleClick={handleClick}
                  />
                ))}{" "}
          </>
        )}
      </div>
    </>
  );
};

export default WordList;
