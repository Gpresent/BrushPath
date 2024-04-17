import React, { useMemo, useState, useEffect } from "react";
import "../styles/styles.css";

import Character from "../types/Character";
import { IndexedDBCachingResult } from "../utils/CharacterSearchContext";
import characterParser from "../utils/characterParser";
import { DocumentData } from "firebase/firestore";
import { addUserDeck } from "../utils/FirebaseQueries";
import { User } from "firebase/auth";
import AddWordList from "./AddWordList";
import "../styles/index.css";
import { useCharacters } from "../utils/FBCharacterContext";

import "../styles/index.css";
import WideModal from "./WideModal";
import InfiniteScroll from "react-infinite-scroller";
import { useDecks } from "../utils/DeckContext";


interface Kanji {
  id: number;
  unicode: string;
  hiragana?: string;
  english: string;
  isSelected?: boolean;
}

interface KanjiModalProps {
  isOpen: boolean;
  onClose: () => void;
  kanjiList: Character[];
  characterCache: IndexedDBCachingResult | null;
  userData: DocumentData | null;
  user: User | null;

}

const KanjiModal: React.FC<KanjiModalProps> = ({
  isOpen,
  onClose,
  characterCache,
  userData,
  user,
}) => {
  const [selectedKanji, setSelectedKanji] = useState<Character[]>([]);
  const [deckTitle, setDeckTitle] = useState("");
  const { kanjiList, fetchCharacters, lastRef } = useCharacters();
  const { decks, fetchDecks } = useDecks();

  useEffect(() => {
    // console.log("HI")
    // if (kanjiList.length == 0) {
    //   console.log("calling dfetch ")
    //   fetchCharacters();  // call this function to fetch characters if not already loaded
    // }
    console.log(kanjiList.length)
  }, []);

  const characters: Character[] | undefined = useMemo(() => {
    //return characterCache?.data?.map((docData) => characterParser(docData) ).filter((character) => character!==null)
    return (characterCache?.data || [])
      .map((docData) => characterParser(docData))
      .filter((character): character is Character => character !== null);
  }, [characterCache?.data]);

  const toggleKanjiSelection = (kanji: Character) => {
    setSelectedKanji((prevSelected) => {
      const isAlreadySelected = prevSelected.some(k => k.unicode === kanji.unicode);
      if (isAlreadySelected) {
        return prevSelected.filter(k => k.unicode !== kanji.unicode);
      } else {
        return [...prevSelected, kanji];
      }
    });
  };

  const handleSubmit = () => {
    // TODO add logic :)
    console.log(user);
    if (deckTitle === "") {
      console.log("No deck title");
      return;
    }

    if (!user?.email) {
      console.log("User not found");
      return;
    }
    if (selectedKanji.length === 0) {
      console.log("No Kanji Selected");
      return;
    }
    if (user?.email) {
      addUserDeck(user?.email, selectedKanji, "", deckTitle).then(() => {
        fetchDecks(); // Fetch decks to update context
      })
        .catch(error => {
          console.error("Failed to add deck or fetch decks:", error);
        });;
    }

    setSelectedKanji([]);
    setDeckTitle("");
    onClose();
  };

  const handleClose = () => {
    setSelectedKanji([]);
    setDeckTitle("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <WideModal title={"New Deck"} onClose={handleClose} isOpen={isOpen} onSubmit={handleSubmit}>

      <div className="deck-title-input">
        <label className="deckTitle" htmlFor="deckTitle">
          Enter Deck Name:
        </label>
        <input
          type="text"
          id="deckTitle"
          value={deckTitle}
          onChange={(e) => setDeckTitle(e.target.value)}
        />
      </div>
      <InfiniteScroll
        style={{ width: "100%" }}
        pageStart={0}
        loadMore={fetchCharacters}
        hasMore={(kanjiList.length < 2136) && (lastRef != "poop")}
        // loader={<LoadingSpinner />}
        useWindow={false}
      >
        {<AddWordList style={{ maxHeight: "55vh" }} words={kanjiList} selectable={true} selectedWords={selectedKanji}
          setSelectedWords={setSelectedKanji} />}
      </InfiniteScroll>

      <ul className="add-word-list">
        {characters?.map((kanji) => (
          <li key={kanji.unicode}>
            <input
              type="checkbox"
              checked={selectedKanji.some((k) => k.unicode === kanji.unicode)}
              onChange={() => toggleKanjiSelection(kanji)}
            />
            {kanji.unicode} - {kanji.one_word_meaning}
          </li>
        ))}
      </ul>
      <button onClick={handleSubmit}>Submit</button>
    </WideModal>
  );
};

export default KanjiModal;
