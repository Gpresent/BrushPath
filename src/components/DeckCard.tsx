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

interface DeckCardProps {
  deck: Deck;
  user: DocumentData
}


const DeckCard: React.FC<DeckCardProps> = ({ deck, user }) => {
  const navigate = useNavigate();
  const { userData, getUserData } = useContext(AuthContext);
  const [showDeleteIcon, setShowDeleteIcon] = useState<boolean>(false);
  let pressTimer: ReturnType<typeof setTimeout> | null = null;
  const [isShaking, setIsShaking] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);


  const handleDeckClick = (deckId: any) => {
    if (!showDeleteIcon && !showConfirmationModal) {
      if (deck._id) {

        //console.log("Deck is being moved to front:", deck)


        updateUserRecentDeck(user.email, deck._id, userData?.decks);


      }
      navigate(`/deck/${deck._id}`);
    }
  };
  const handleTrashClick = () => {
    console.log("Trashcan Clicked: You're Trash!");
    setShowConfirmationModal(true)
    setShowDeleteIcon(false);
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
    <div className={`deck-card clip-contents ${showDeleteIcon ? 'shaking' : ''}`} onClick={() => handleDeckClick(deck._id)}
      onMouseDown={startPressTimer}
      onMouseUp={handleMouseUpOrTouchEnd}
      onMouseLeave={handleMouseLeaveOrTouchMove}
      onTouchStart={startPressTimer}
      onTouchEnd={handleMouseUpOrTouchEnd}
      onTouchMove={handleMouseLeaveOrTouchMove}
    >
      {showDeleteIcon && (
        <DeleteForeverIcon className="delete-icon" onClick={() => handleTrashClick()} />
      )}
      <div className="cover-image" style={{ backgroundImage: `url(${deck.image})` }}>
      </div>
      <p className="title">{deck.name}</p>

    <ConfirmationModal
      deck={deck}
      user={user} 
      isOpen={showConfirmationModal}
      onClose={closeConfirmationModal}
    />

    </div>
  );
};

export default DeckCard;
