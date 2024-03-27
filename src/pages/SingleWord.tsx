import Character from "../types/Character";
import "../styles/styles.css";
import "../styles/dict.css";
import Draw from "./Draw";
import { useLocation } from "react-router-dom";

const SingleWordView: React.FC = () => {
  let { state } = useLocation();
  let character : Character = state.character;

  let meaning_len = 0;

  let font_size = 28;

  if (character && character.english) {
    character.english.forEach((meaning) => {
      meaning_len += meaning.length;
    })
  }

  if(meaning_len > 30){
    font_size = 20;
    if(meaning_len > 75){
      font_size = 15;
    }
  }

  return (
    <div className="single-word-view">
      {character && (
        <>
          <div className="character-header">
            <div className="character-kanji">{character.unicode}</div>
            {character.english.length > 0 && (
            <div className="character-meanings" style={{fontSize: `${font_size}px`}}>
              {character.english.map((meaning, index) => {
                return <span>{(index ? ", " : "") + meaning}</span>;
              })}
            </div>
            )}
          </div>
          <div className="character-info">
            <div className="info-line">stroke: {character.stroke_count} </div>
            {character.kun.length > 0 && (
              <div className="info-line">
                kun:{" "}
                {character.kun.map((kun, index) => {
                  return (index ? ", " : "") + kun;
                })}
              </div>
            )}
            {character.on.length > 0 && (
              <div className="info-line">
                on:{" "}
                {character.on.map((on, index) => {
                  return (index ? ", " : "") + on;
                })}
              </div>
            )}
            {character.radicals.length > 0 && (
              <div className="info-line">
                radicals:{" "}
                {character.radicals.map((radical, index) => {
                  return (index ? ", " : "") + radical;
                })}
              </div>
            )}
            {character.jlpt && (
              <div className="info-line">JLPT: {character.jlpt} </div>
            )}
            {character.freq && (
              <div className="info-line">frequency: {character.freq} </div>
            )}
            {character.grade && (
              <div className="info-line">grade: {character.grade} </div>
            )}
          </div>
          <div className="mastery-desc">
            You are <b>unfamiliar</b> with this character.
          </div>
          <Draw character={character} allowDisplay={true} />
        </>
      )}
    </div>
  );
};

export default SingleWordView;
