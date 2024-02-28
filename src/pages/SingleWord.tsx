import Character from "../types/Character";




interface SingleWordProps {
  character: Character;
}

const SingleWordView: React.FC<SingleWordProps> = ({ character }) => {
  return (
    <div className="single-word-view">
      <div className="character-header">
        <div className="character-kanji"></div>
        <div className="character-meanings">
          {character.english.map((meaning) => {
            return <span>{meaning}, </span>;
          })}
        </div>
      </div>
      <div className="character-info">
        <div className="left-col">
          stroke: {character.stroke_count}
          {character.radicals.length > 0 && (
            <div>
              radicals:{" "}
              {character.radicals.map((radical) => {
                return <span>{radical}, </span>;
              })}
            </div>
          )}
          {character.kun.length > 0 && (
            <div>
              kun:{" "}
              {character.kun.map((kun) => {
                return <span>{kun}, </span>;
              })}
            </div>
          )}
          {character.on.length > 0 && (
            <div>
              on:{" "}
              {character.on.map((on) => {
                return <span>{on}, </span>;
              })}
            </div>
          )}
        </div>
        <div className="right-col">
            {character.jlpt && <div>JLPT: {character.jlpt} </div>}
            {character.freq && <div>frequency: {character.freq} </div>}
            {character.grade && <div>grade: {character.grade} </div>}
        </div>
      </div>
    </div>
  );
};

export default SingleWordView;
