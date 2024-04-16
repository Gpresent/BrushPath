import React, { useState, useContext, useEffect, MouseEvent } from "react";
import "../styles/styles.css";
import Deck from "../types/Deck";
import { Link, useNavigate } from "react-router-dom";
import { DocumentData } from "firebase/firestore";
import { updateUserRecentDeck } from "../utils/FirebaseQueries";
import { AuthContext } from "../utils/FirebaseContext";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ConfirmationModal from '../components/ConfirmationModal';
import {
  refEqual
} from "firebase/firestore";

interface DeckListRowProps {
  deck: Deck;
  user: DocumentData
  initialSelected?: boolean
  handleDeckClick: (arg0: string, arg1: boolean) => void
}



const DeckListRow: React.FC<DeckListRowProps> = ({ deck, user,initialSelected, handleDeckClick }) => {
  const navigate = useNavigate();
  const { userData, getUserData } = useContext(AuthContext);
  const [showDeleteIcon, setShowDeleteIcon] = useState<boolean>(false);
  let pressTimer: ReturnType<typeof setTimeout> | null = null;
  const [isShaking, setIsShaking] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selected, setSelected] = useState<boolean>(initialSelected || false);

  const handleDeckClickHandler = () => {
    if(deck?.userRef?.id !== user.email) {
      return;
    }
    setSelected((prevState: boolean) => {
        const newState = !selected;
        if(deck._id) {
            handleDeckClick(deck._id,newState)
        }
        
        return newState;
        }
        );
  };

  

  
  

  

  return (
    
    <>
      <div className="deck-card" onClick={handleDeckClickHandler}>
        <p className="deck-name">{deck.name}</p>
        <p className="hiragana">{ }</p>
        <input type="checkbox" checked={selected} disabled={deck?.userRef?.id !== user.email} className="deck-check"/>
      </div>
    </>
    

    
  );
};

export default DeckListRow;
