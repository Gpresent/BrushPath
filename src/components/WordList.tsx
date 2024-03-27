import React from 'react';
import WordCard from './WordCard';
import Character from '../types/Character';

interface WordListProps {
  words: Character[];
}

const WordList: React.FC<WordListProps> = ({ words }) => {
  //console.log(words)
  return (
    <div className="word-list">
      {words.map((word) => (
        <WordCard key={word.unicode} character={word} />

      ))}
    </div>
  );
};

export default WordList;