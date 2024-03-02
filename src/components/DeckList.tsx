import React from 'react';
import DeckCard from './DeckCard';
import Deck from '../types/Deck';

interface DeckListProps {
  decks: Deck[];
  onDeckClick: (deckId: number) => void; 
}

const DeckList: React.FC<DeckListProps> = ({ decks, onDeckClick }) => {
  return (
    <div className="deck-list">
      {decks.map((deck) => (
        <DeckCard 
          key={deck.id} 
          deck={deck} 
          onClick={() => onDeckClick(deck.id)} 
        />
      ))}
    </div>
  );
};

export default DeckList;