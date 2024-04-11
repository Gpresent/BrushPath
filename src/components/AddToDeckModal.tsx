import React, { useMemo, useState } from "react";
import "../styles/styles.css";

import Character from "../types/Character";
import { IndexedDBCachingResult } from "../utils/CharacterSearchContext";
import characterParser from "../utils/characterParser";
import { DocumentData } from "firebase/firestore";
import { addUserDeck } from "../utils/FirebaseQueries";
import { User } from "firebase/auth";

import "../styles/index.css";

import "../styles/index.css";
import Modal from "./Modal";

interface Deck {
  id: string;
}

interface AddModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const KanjiModal: React.FC<AddModalProps> = ({isOpen, onClose}) => {
  const [selectedKanji, setSelectedKanji] = useState<Character[]>([]);
  const [deckTitle, setDeckTitle] = useState("");

  const handleSubmit = () => {
    // TODO add logic :)
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal title={"Add To Deck"} onClose={handleClose} isOpen={isOpen} onSubmit={handleSubmit}>
      <div className="deck-title-input">
        <label className="deckTitle" htmlFor="deckTitle">
        </label>
      </div>
      <ul className="add-word-list">
        
      </ul>
      <button onClick={handleSubmit}>Submit</button>
    </Modal>
  );
};

export default KanjiModal;
