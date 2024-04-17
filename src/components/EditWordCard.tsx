import React from "react";
import '../styles/styles.css'
import Character from "../types/Character";
import { Link } from "react-router-dom";

interface WordCardProps {
  character: Character;
  selectable?: boolean;
  handleClick?: (character: Character) => void;
  selectedWords: Character[] | undefined;
  toggleSelection?: (character: Character) => void;
}

const EditWordCard: React.FC<WordCardProps> = ({ character, selectable, handleClick, selectedWords }) => {

  const isSelected = selectedWords?.some(k => k.unicode === character.unicode);
  if (selectable) {
    return (
      <>
        <div>
          <input
            type="checkbox"
            checked={!!isSelected}
            onChange={() => handleClick ? handleClick({ ...character, selected: isSelected }) : null}
            className="select-checkbox"
          />
          <p className="character">{character.unicode}</p>
          <p className="hiragana">{ }</p>
          <p className="meaning">{character.one_word_meaning}</p>
        </div>
      </>
    );
  }
  return (
    <>
      <Link to={{ pathname: '/character' }} state={{ character }} className="word-card">
        <p className="character">{character.unicode}</p>
        <p className="hiragana">{ }</p>
        <p className="meaning">{character.one_word_meaning}</p>
      </Link>
    </>
  );
};

export default EditWordCard;