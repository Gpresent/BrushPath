import React from 'react';
import ReviewWordCard from './rv_word';
import Character from '../../types/Character';

interface WordListProps {
  words: Character[];
}


const PlayList: React.FC<WordListProps> = ({ words }) => {
  //console.log(words)
  return (
    <div className="word-list">
      {words.map((word) => (
        <ReviewWordCard key={word.unicode} character={word} />
      ))}
    </div>
  );
};

export default PlayList;