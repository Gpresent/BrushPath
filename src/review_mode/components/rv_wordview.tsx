import React from 'react';
import ReviewWordCard from './rv_word';
import Character from '../../types/Character';
import { useLocation } from 'react-router-dom';
import Draw from '../../pages/Draw';

interface WordListProps {
  words: Character[];
}


const ReviewWordView: React.FC = () => {
  
  const {state} = useLocation();
  console.log(state);
  return (
    <>
    <div className="character-prompt">{state.character.one_word_meaning}</div>
    <Draw recall={true} character={state.character} allowDisplay={false} />
    </>
  );
};

export default ReviewWordView;