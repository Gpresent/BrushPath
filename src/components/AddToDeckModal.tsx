import React, { useMemo, useState, useContext, useEffect} from "react";
import "../styles/styles.css";

import Character from "../types/Character";
import { IndexedDBCachingResult } from "../utils/CharacterSearchContext";
import characterParser from "../utils/characterParser";
import { DocumentData } from "firebase/firestore";
import { addUserDeck } from "../utils/FirebaseQueries";
import { User } from "firebase/auth";
import { AuthContext } from "../utils/FirebaseContext";
import { CharacterSearchContext } from "../utils/CharacterSearchContext";
import { getDecksFromRefs } from "../utils/FirebaseQueries";
import LoadingSpinner from "../components/LoadingSpinner";
import DeckList from "../components/DeckList";

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
  const { userData, getUserData, user } = useContext(AuthContext);
  const characterCache = useContext(CharacterSearchContext);
  const [decks, setDecks] = useState<any>([]);

  useEffect(() => {
    if (!userData) {
      getUserData();
    }
  }, []);

  useEffect(() => {
    const fetchDecks = async () => {
      if (userData && userData.decks) {
        const fetchedDecks = await getDecksFromRefs(userData.decks);
        setDecks(fetchedDecks);
      }
    };

    fetchDecks();
  }, [userData]);

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

        <div className="deck-list-container">
        {
          !userData ? <LoadingSpinner /> : <DeckList decks={decks}
            user={userData} length={decks.length} />
        }
      </div >
        
      </ul>
      <button onClick={handleSubmit}>Submit</button>
    </Modal>
  );
};

export default KanjiModal;
