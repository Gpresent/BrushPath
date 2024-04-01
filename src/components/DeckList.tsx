import React from 'react';
import DeckCard from './DeckCard';
import Deck from '../types/Deck';
import { DocumentData } from 'firebase/firestore';

interface DeckListProps {
  decks: any[],
  user: DocumentData,
}

const DeckList: React.FC<DeckListProps> = ({ decks, user }) => {

  return (
    <div className="deck-list">
      {decks.map((deck, index) => (
        <DeckCard
          key={index} // Using the index as a key
          deck={deck}
          user={user}
        />
      ))}

    </div>
  );
};

export default DeckList;