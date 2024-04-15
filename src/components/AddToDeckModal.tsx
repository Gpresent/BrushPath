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
import WideModal from "./WideModal";
import SelectableDeckList from "./SelectableDeckList";

interface Deck {
  id: string;
}

interface AddModalProps {
  isOpen: boolean;
  onClose: () => void;
  character: Character;
}

const AddToDeckModal: React.FC<AddModalProps> = ({isOpen, onClose, character}) => {
  
  const { userData, getUserData, user } = useContext(AuthContext);
  const [decks, setDecks] = useState<any>([]);
  const [selectedDecks, setSelectedDecks] = useState<any>([]);

  useEffect(() => {
    if (!userData) {
      getUserData();
    }
  }, []);

  useEffect(() => {
    const fetchDecks = async () => {
      if (userData && userData.decks) {
        const fetchedDecks = await getDecksFromRefs(userData.decks)
        setDecks(fetchedDecks);
        setSelectedDecks(fetchedDecks.filter((deck: any) => deck.characters.some((ref: { id: string; }) => ref.id === character.unicode_str) ));

        
      }
    };

    fetchDecks();
  }, [userData]);

  const savedInDecks = useMemo(() => {
    return decks.filter((deck: any) => deck.characters.some((ref: { id: string; }) => ref.id === character.unicode_str) )
  },[decks,character])

  const notSavedInDecks = useMemo(() => {
    return decks.filter((deck: any) => !deck.characters.some((ref: { id: string; }) => ref.id === character.unicode_str) )
  },[decks,character])

  const handleSubmit = () => {
    // TODO add logic :)
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  const handleDeckClick = (deckID: string, selectedState: boolean) => {
    //Update Selected
    setSelectedDecks((prevSelectedDecks: any) => {
      if(selectedState) {
        if(prevSelectedDecks.some((deck: any) => deck._id === deckID)) {
          return prevSelectedDecks;
        }else {
          return [prevSelectedDecks, ...decks.filter((deck: any) => deck._id === deckID)]
        }
        
      }
      else {
        return prevSelectedDecks.filter((deck: any) => deck._id !== deckID)
      }
      
    })
    
  }

  if (!isOpen) return null;

  return (
    <WideModal title={"Add To Deck"} onClose={handleClose} isOpen={isOpen} onSubmit={handleSubmit}>
      <div className="deck-title-input">
        <label className="deckTitle" htmlFor="deckTitle">
        </label>
      </div>
      <ul className="add-word-list">

        <div className="deck-list-container">

        {
          !userData ? <LoadingSpinner /> : <><p>Saved in </p><SelectableDeckList decks={savedInDecks} 
            user={userData} preSelect={true} handleDeckClick={handleDeckClick} />
            <p>Other Decks</p>
            <SelectableDeckList decks={notSavedInDecks}
            user={userData} handleDeckClick={handleDeckClick} />
            </>
        }
      </div >
        
      </ul>
      <button onClick={handleSubmit}>Submit</button>
    </WideModal>
  );
};

export default AddToDeckModal;
