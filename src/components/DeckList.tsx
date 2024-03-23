import React from 'react';
import DeckCard from './DeckCard';
import Deck from '../types/Deck';

interface DeckListProps {
  decks: any[];
  onDeckClick: (deckId: number) => void;
}

const DeckList: React.FC<DeckListProps> = ({ decks, onDeckClick }) => {

  return (
    <div className="deck-list">
      {decks.map((deck, index) => (
        <DeckCard
          key={index} // Using the index as a key
          deck={deck}
          onClick={() => onDeckClick(deck._id)}
        />
      ))}

    </div>
  );
};

export default DeckList;