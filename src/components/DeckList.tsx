import React from 'react';
import DeckCard from './DeckCard';
import Deck from '../types/Deck';

interface DeckListProps {
  decks: any[];
}

const DeckList: React.FC<DeckListProps> = ({ decks }) => {

  return (
    <div className="deck-list">
      {decks.map((deck, index) => (
        <DeckCard
          key={index} // Using the index as a key
          deck={deck}
        />
      ))}

    </div>
  );
};

export default DeckList;