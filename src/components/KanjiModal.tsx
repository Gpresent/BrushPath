import React, { useMemo, useState } from "react";
import "../styles/styles.css";

import Character from "../types/Character";
import { IndexedDBCachingResult } from "../utils/useIndexedDBCaching";
import characterParser from "../utils/characterParser";
import { DocumentData } from "firebase/firestore";
import { addUserDeck } from "../utils/FirebaseQueries";
import { User } from "firebase/auth";

import "../styles/index.css";

import "../styles/index.css";


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
  kanjiList: Kanji[];
  characterCache: IndexedDBCachingResult | null,
  userData: DocumentData | null,
  user: User | null
}


const KanjiModal: React.FC<KanjiModalProps> = ({ isOpen, onClose, kanjiList, characterCache, userData, user }) => {
  const [selectedKanji, setSelectedKanji] = useState<Character[]>([]);
  const [deckTitle, setDeckTitle] = useState("");

  const characters: Character[] | undefined = useMemo(() => {
    //return characterCache?.data?.map((docData) => characterParser(docData) ).filter((character) => character!==null)
    return (characterCache?.data || []).map((docData) => characterParser(docData)).filter((character): character is Character => character !== null);
  }, [characterCache?.data])

  const toggleKanjiSelection = (kanji: Character) => {
    const isAlreadySelected = selectedKanji.some((k) => k.unicode === kanji.unicode);
    if (isAlreadySelected) {
      setSelectedKanji(selectedKanji.filter((k) => k.unicode !== kanji.unicode));
    } else {
      setSelectedKanji([...selectedKanji, kanji]);
    }
  };



  const handleSubmit = () => {
    // TODO add logic :)
    console.log(user);
    if (deckTitle === "") {
      console.log("No deck title");
      return;
    }

    if (!user?.email) {
      console.log("User not found")
      return;
    }
    if (selectedKanji.length === 0) {
      console.log("No Kanji Selected");
      return;
    }
    if (user?.email) {
      addUserDeck(user?.email, selectedKanji, "", deckTitle);
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
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={handleClose}>&times;</span>
        <div className="deck-title-input">
          <label className="deckTitle" htmlFor="deckTitle">Enter Deck Name:</label>
          <input
            type="text"
            id="deckTitle"
            value={deckTitle}
            onChange={(e) => setDeckTitle(e.target.value)}
          />
        </div>
        <ul className="add-word-list">
          {characters?.map(kanji => (
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
      </div>
    </div>
  );
};

export default KanjiModal;