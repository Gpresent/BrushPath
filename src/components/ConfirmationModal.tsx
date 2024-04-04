import React from 'react';
import "../styles/settings.css";
import "../styles/index.css";
import Deck from "../types/Deck";
import { DocumentData } from "firebase/firestore";

interface ConfirmationModalProps {
    deck: Deck;
    user: DocumentData;
    isOpen: boolean;
    onClose: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ deck, user, isOpen, onClose}) => {
  if (!isOpen) return null;

const handleConfirmClick = () => {
    console.log("Deleted", deck._id);
    
    //sam logic here :)

    onClose();
};

  return (
    <div className="modal">
      <div className="confirmation-modal-content">
        <span>Are you sure you want to delete deck '{deck.name}' ?</span>
        <div className="confirmation-button-container">
            <button className="confirmation-button" onClick={handleConfirmClick}>Yes</button>
            <button className="confirmation-button" onClick={onClose}>No</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;