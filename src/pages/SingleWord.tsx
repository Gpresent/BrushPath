import Character from "../types/Character";
import "../styles/styles.css";
import "../styles/dict.css";
import Draw from "./Draw";

interface SingleWordProps {
  character: Character;
}

const SingleWordView: React.FC<SingleWordProps> = ({ character }) => {
  return (
    <div className="single-word-view">
      <div className="character-header">
        <div className="character-kanji">{character.unicode}</div>
        <div className="character-meanings">
          {character.english.map((meaning, index) => {
            return <span>{(index ? ", " : "") + meaning}</span>;
          })}
        </div>
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
      <Draw character={character} />
    </div>
  );
};

export default SingleWordView;
