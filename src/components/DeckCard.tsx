import React from "react";
import "../styles/styles.css";
import Deck from "../types/Deck";

interface DeckCardProps {
  deck: Deck;
  onClick: () => void;
}

const DeckCard: React.FC<DeckCardProps> = ({ deck, onClick }) => {


  return (
    <div className="deck-card clip-contents" onClick={onClick}>
      <div className="cover-image" style={{ backgroundImage: `url(${deck.image})` }}>
      </div>
      <p className="title">{deck.name}</p>
    </div>
  );
};

export default DeckCard;
