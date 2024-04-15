import React from 'react';
import DeckCard from './DeckCard';
import Deck from '../types/Deck';
import { DocumentData } from 'firebase/firestore';
import DeckListRow from './DeckListRow';

interface SelectableDeckListProps {
  decks: any[],
  user: DocumentData,
}

const SelectableDeckList: React.FC<SelectableDeckListProps> = ({ decks, user }) => {

  return (
    <div className="deck-list">
      {decks.map((deck, index) => (
        <DeckListRow
          key={index} // Using the index as a key
          deck={deck}
          user={user}
        />
      ))}

    </div>
  );
};

export default SelectableDeckList;