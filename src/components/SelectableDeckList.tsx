import React from 'react';
import DeckCard from './DeckCard';
import Deck from '../types/Deck';
import { DocumentData } from 'firebase/firestore';
import DeckListRow from './DeckListRow';

interface SelectableDeckListProps {
  decks: any[],
  user: DocumentData,
  preSelect?: boolean,
  handleDeckClick: (arg0: string, arg1: boolean) => void
}

const SelectableDeckList: React.FC<SelectableDeckListProps> = ({ decks, user, preSelect , handleDeckClick}) => {

  return (
    <div className="deck-select-list">
      {decks.map((deck, index) => (
        <DeckListRow
          key={index} // Using the index as a key
          deck={deck}
          user={user}
          initialSelected={preSelect || false}
          handleDeckClick={handleDeckClick}
        />
      ))}

    </div>
  );
};

export default SelectableDeckList;