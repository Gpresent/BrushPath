import React from "react";
import "../styles.css";
import Deck from "../types/Deck"; 

interface DeckCardProps {
  deck: Deck;
}

const DeckCard: React.FC<DeckCardProps> = ({ deck }) => {
  return (
    <>
    <div className="deck-card clip-contents">
        <div className="cover-image" style={{ backgroundImage: `url(${deck.coverImage})` }}>
        </div>
        <p className="title">{deck.name}</p>
    </div>
    </>
  );
};

export default DeckCard;
