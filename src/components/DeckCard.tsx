import React from "react";
import "../styles/styles.css";
import Deck from "../types/Deck";
import { Link, useNavigate } from "react-router-dom";

interface DeckCardProps {
  deck: Deck;
}

const DeckCard: React.FC<DeckCardProps> = ({ deck}) => {
  const navigate = useNavigate();
  
  const handleDeckClick = (deckId: any) => {
    console.log('Deck clicked:', deckId);
    navigate(`/deck/${deck._id}`);

  };

  return (
    <div className="deck-card clip-contents" onClick={handleDeckClick}>
      <div className="cover-image" style={{ backgroundImage: `url(${deck.image})` }}>
      </div>
      <p className="title">{deck.name}</p>
    </div>
  );
};

export default DeckCard;
