import React from 'react';
import "../styles/settings.css";
import "../styles/index.css";
import Deck from "../types/Deck";
import { DocumentData } from "firebase/firestore";
import Modal from './Modal';
import { deleteDeck } from "../utils/FirebaseQueries"
interface ConfirmationModalProps {
  deck: Deck;
  user: DocumentData;
  isOpen: boolean;
  onClose: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ deck, user, isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleConfirmClick = () => {
    console.log("Deleted", deck._id);

    deleteDeck(user.email, deck);
    //sam logic here :)

    onClose();
  };

  return (
    <Modal title={"Confirmation"} isOpen={isOpen} onClose={onClose}>
      <span>Are you sure you want to delete deck '{deck.name}' ?</span>
      <div className="confirmation-button-container">
        <button className="confirmation-button" onClick={handleConfirmClick}>Yes</button>
        <button className="confirmation-button" onClick={onClose}>No</button>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;