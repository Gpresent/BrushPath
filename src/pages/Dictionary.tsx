import React, {
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import "../styles/styles.css";
import "../styles/dict.css";
import Character from "../types/Character";
import WordList from "../components/WordList";
import characterParser from "../utils/characterParser";
import app, { auth, db } from "../utils/Firebase";
import { fetchAllCharacters } from "../utils/FirebaseQueries";

import {
  DocumentData,
} from "firebase/firestore";
import Loading from "../components/Loading";
import InfiniteScroll from "react-infinite-scroller";
import LoadingSpinner from "../components/LoadingSpinner";

interface DictionaryProps {
  title: string;
  kanjiList: Character[];
  setKanjiList: React.Dispatch<React.SetStateAction<any[]>>;
  lastRef: string;
  setLastRef: React.Dispatch<React.SetStateAction<string>>;
}

const DictionaryView: React.FC<DictionaryProps> = ({ kanjiList, setKanjiList, title, lastRef, setLastRef }) => {
  // console.log("what the fuck")

  // const characterCache = useContext(CharacterSearchContext);
  const [loading, setLoading] = useState(false);

  const fetchChars = useCallback(async () => {

    let batch = 30;

    console.log(lastRef)
    console.log(kanjiList.length)

    await fetchAllCharacters(lastRef, batch).then((fetchResponse) => {
      if (fetchResponse.cachedData) {
        // console.log("got data")
        let newData = fetchResponse.cachedData
          .filter((result) => result !== undefined && result !== null)
          .map((value: DocumentData) => characterParser(value))
          .filter(
            (result) =>
              result !== null &&
              result !== undefined &&
              !kanjiList.includes(result)
          );
        // console.log("data is processed")
        setKanjiList(kanjiList.concat(newData as any));
      } else {
        // console.log("deck.data or something not found, not fetching");
      }
      setLastRef(fetchResponse.skipRef);
    });
  }, [lastRef]);



  return (
    <div className="dictionary-view">
      <p className="my-words">Dictionary</p>
      <InfiniteScroll
        style={{ width: "100%" }}
        pageStart={0}
        loadMore={fetchChars}
        hasMore={(kanjiList.length < 2136) && (lastRef != "poop")}
        // loader={<LoadingSpinner />}
        useWindow={false}
      >
        {<WordList style={{ maxHeight: "70vh" }} words={kanjiList} />}
      </InfiniteScroll>

    </div>
  );
};

export default DictionaryView;
