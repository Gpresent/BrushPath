import React from 'react';
import "../styles/settings.css";
import "../styles/index.css";
import Deck from "../types/Deck";
import { DocumentData } from "firebase/firestore";
import Modal from './Modal';

interface ConfirmationModalProps {
    deck: Deck;
    isOpen: boolean;
    onClose: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ deck, isOpen, onClose}) => {
  if (!isOpen) return null;

const handleConfirmClick = () => {
    console.log("Deleted", deck._id);
    
    //sam logic here :)

    onClose();
};

  return (
    <Modal title={deck.name} isOpen={isOpen} onClose={onClose}>
        <span>{deck.desc}</span>
    </Modal>
  );
};

export default ConfirmationModal;