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
}



const DeckListRow: React.FC<DeckListRowProps> = ({ deck, user }) => {
  const navigate = useNavigate();
  const { userData, getUserData } = useContext(AuthContext);
  const [showDeleteIcon, setShowDeleteIcon] = useState<boolean>(false);
  let pressTimer: ReturnType<typeof setTimeout> | null = null;
  const [isShaking, setIsShaking] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const handleDeckClick = (deckId: any) => {
    
    
  };

  const closeConfirmationModal = () => {
    setShowConfirmationModal(false);
  }

  const startPressTimer = () => {
    pressTimer = setTimeout(() => setShowDeleteIcon(true), 1000); // adjust time as needed
  };

  const clearTimer = () => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      pressTimer = null;
    }
  };

  const handleMouseUpOrTouchEnd = () => {
    clearTimer();
  };

  const handleMouseLeaveOrTouchMove = () => {
    clearTimer();
    setShowDeleteIcon(false);
  };

  return (
    
    <>
      <div className="deck-card">
        <p className="deck-name">{deck.name}</p>
        <p className="hiragana">{ }</p>
        <input type="checkbox" className="deck-check"/>
      </div>
    </>
    

    
  );
};

export default DeckListRow;
