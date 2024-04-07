import React, { Dispatch, SetStateAction, useMemo } from 'react';
import WordCard from './WordCard';
import Character from '../types/Character';

interface WordListProps {
  words: Character[];
  selectedWords?: Character[];
  setSelectedWords?: Dispatch<SetStateAction<Character[]>>;
  selectable?: boolean;
  
}

const WordList: React.FC<WordListProps> = ({ words, selectedWords, selectable, setSelectedWords }) => {
  const modifiedWords = useMemo(() => {
    console.log("words")
    if(selectedWords === null) {
      return words;
    }
    return words.map((word) => {
      const selected = selectedWords?.find((selectedWord) => selectedWord.unicode === word.unicode)? true: false;
      return {...word, selected}
    })
  },[selectedWords])

  const handleClick = (selectedCharacter:Character) => {
    console.log("Selected ", selectedCharacter)
    if(setSelectedWords && selectedWords) {
      //If it is selected, remove it
      if(selectedCharacter.selected) {
        setSelectedWords(selectedWords.filter((char) => char.unicode !== selectedCharacter.unicode))
      }
      else {
        setSelectedWords([...selectedWords, selectedCharacter])
      }
      
    }
    
  }
  return (
    <div className="word-list">
      
        {words.map((word) => (
          <WordCard key={word.unicode} character={word} selectable={selectable} handleClick={handleClick} />

        ))}
      
        
        
      

      
    </div>
  );
};

export default WordList;