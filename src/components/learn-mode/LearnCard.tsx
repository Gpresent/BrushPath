import react, { useEffect, useMemo, useRef, useState } from "react";
import Character from "../../types/Character";
import Draw from "../../pages/Draw";
import "../../styles/learn.css";
import KanjiGrade from "../../types/KanjiGrade";
import { debug } from "console";
import DrawReview from "../../pages/DrawReview";
import ArrowForward from "@mui/icons-material/ArrowForward";

interface LearnCardProps {
  character: Character;
  handleAdvance: (arg0: Character, arg1: KanjiGrade) => void;
  learn: boolean;
  recall: boolean;
}

const LearnCard: React.FC<LearnCardProps> = ({ character, handleAdvance, learn, recall }) => {
  const [grade, setGrade] = useState<KanjiGrade | null>(null);
  const [attempts, setAttempts] = useState<KanjiGrade[]>([]);
  const [allowDisplay, setAllowDisplay] = useState<boolean>(false);
  const [numAttempts, setNumAttempts] = useState<number>(0);

  const handleComplete = (character: Character, grade: KanjiGrade) => {
    setGrade(grade);
    setAttempts((prevAttempts) => {

      if (!allowDisplay) {
        const gradeIsNull =
          (grade !== null && grade.overallGrade === null) ||
          isNaN(grade.overallGrade);
        const gradeIsNotHighEnough =
          grade !== null &&
          grade.grades.length > 0 &&
          Math.max(...grade.grades) < 60;
        // debugger;

        setAllowDisplay(gradeIsNotHighEnough || gradeIsNull);

      }
      return [...prevAttempts, grade]
    })


  };

  //Todo, replace divs with actual tags lol
  return (
    <div className="learn-cards-container">
      {/* <div className="learn-card-title">
                {character.one_word_meaning}
            </div> */}
      {/* <div className="learn-card-info">
                
            </div> */}
      <div className="learn-card-draw-container">
        {/* <Draw  handleComplete={handleComplete} key={character.unicode}  allowDisplay={ allowDisplay } character={character}  /> */}
        <DrawReview
          handleComplete={handleComplete}
          char={character}
          handleAdvance={handleAdvance}
          recall={recall}
          learn={learn}
        ></DrawReview>
      </div>

      {/* <div className="learn-card-nav-row"> */}
      {/* <div></div> */}
      {/* {grade && grade.overallGrade > 50 && (
          <button
            onClick={() => {
              setAllowDisplay(false);
              handleAdvance(character, grade);
              setGrade(null);
            }}
            className="learn-card-nav-right"
          >
            <ArrowForward/>
          </button>
        )} */}
      {/* </div> */}
    </div>
  );
};

export default LearnCard;
