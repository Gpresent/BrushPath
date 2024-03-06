import React from 'react';
import DeckCard from './DeckCard'; 
import Deck from '../types/Deck';

interface DeckListProps {
  decks: Deck[];
}


const DeckList: React.FC<DeckListProps> = ({ decks }) => {
  return (
    <div className="deck-list">
      {decks.map((deck) => (
        <DeckCard key={deck.id} deck={deck} />
      ))}
    </div>
  );
};

export default DeckList;