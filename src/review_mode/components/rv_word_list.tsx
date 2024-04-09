import React from 'react';
import ReviewWordCard from './rv_word';
import Character from '../../types/Character';
import { getCharsFromRefs } from '../../utils/FirebaseQueries';

interface WordListProps {
  words: Character[];
}


const PlayList: React.FC<WordListProps> =  ({ words }) => {
  //console.log(words)
  return (
    <>
      <div className="word-list">
      <button style={{ marginBottom:"10px", width:"100%"}} onClick={()=>{console.log("test")}}>Study Terms</button>
        <h2>Review List</h2>
        {words.map((word) => (
          <ReviewWordCard key={word.unicode} character={word} />
        ))}
      </div>
    </>
  );
};

export default PlayList;