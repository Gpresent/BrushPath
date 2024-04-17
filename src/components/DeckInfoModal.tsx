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

  return (
    <Modal title={deck.name} isOpen={isOpen} onClose={onClose}>
      {deck.desc.split(".").map((sentence, index) => (
        (sentence !== "" && 
        <div>
          {(index !== 0 && <br/>)}
          <p key={index}>{sentence + "."}</p>
        </div>)
      ))}
    </Modal>
  );
};

export default ConfirmationModal;