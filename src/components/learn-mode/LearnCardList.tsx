import react, { useEffect, useMemo, useRef, useState } from "react";
import Character from "../../types/Character";
import Draw from "../../pages/Draw";
import "../../styles/learn.css";
import LearnCard from "./LearnCard";
import KanjiGrade from "../../types/KanjiGrade";
import { grad } from "@tensorflow/tfjs";
// import { CharacterSearchProvider } from '../../utils/FirebaseCharacterSearchContext';
import { useNavigate, useParams } from "react-router-dom";
import WideModal from "../WideModal";

interface LearnCardListProps {
  characters: Character[];
  refetch?: (numCharacters?: number) => void;
  learn:boolean
}
type CharacterSessionData = Character & {
  score?: KanjiGrade;
};

const LearnCardList: React.FC<LearnCardListProps> = ({
  characters,
  refetch,
  learn
}) => {
  const [currentCharacterIndex, setCurrentCharacterIndex] = useState<number>(0);

  const [characterSessionData, setCharacterSessionData] =
    useState<CharacterSessionData[]>(characters);

  const [finished, setFinished] = useState<boolean>(false);

  const [showSessionModal, setShowSessionModal] = useState<boolean>(false);

  const canvasRef = useRef<any>();

  const setRef = (ref: any) => {
    canvasRef.current = ref;
  };

  const handleAdvance = (char: Character, grade: KanjiGrade) => {
    console.log("Completed: ", char);

    setCharacterSessionData((prevData: CharacterSessionData[]) =>
      prevData.map((character) => {
        if (character.unicode === char.unicode) {
          console.log(grade);
          return { ...character, score: grade };
        }

        return character;
      })
    );
    if (currentCharacterIndex === characterSessionData.length - 1) {
      setFinished(true);
      setShowSessionModal(true);
      return;
    }
    setCurrentCharacterIndex((prevIndex) => {
      return prevIndex + 1;
    });
  };
  const currentCharacter = useMemo(() => {
    return characterSessionData[currentCharacterIndex];
  }, [currentCharacterIndex]);
  useEffect(() => {
    //Build components
  }, []);

  const numKanjiLearned = useMemo(() => {
    return characterSessionData.filter((character) => {
      return character.score !== undefined;
    }).length;
  }, [characterSessionData]);
  const avgScore = useMemo(() => {
    const scoredChars = characterSessionData.filter((character) => {
      return character.score !== undefined;
    });
    return (
      scoredChars.reduce((accumulator, char) => {
        // console.log(char.score?.grades ? Math.max(...char.score?.grades || 0):0);
        // console.log(char.unicode);
        return char.score?.grades
          ? Math.max(...(char.score?.grades || 0)) + accumulator
          : accumulator;
      }, 0) / scoredChars.length
    );
  }, [characterSessionData]);

  function onClose() {
    navigate(`/deck/${id}`);
    setShowSessionModal(false)
  }

  const navigate = useNavigate();
  let { id } = useParams();

  //Todo, replace divs with actual tags lol
  return (
    <div>
      {/* <p>
                Kanji Learned {numKanjiLearned}
                Kanji Left {characterSessionData.length - numKanjiLearned}
                
            </p> 
            map((on, index) => {
                      return (index ? ", " : "") + on;
                    })*/}
      {finished && showSessionModal ? (
        <WideModal
          title={"Session Complete"}
          isOpen={showSessionModal}
          onClose={onClose}
        >
          <div className="session-recap">
            <div className="session-info-header">Here's what you did:</div>
            <div className="session-info">
              <>Learned {characterSessionData.length} new characters: </>

              {characterSessionData
                .filter((character) => {
                  return character.score !== undefined;
                })
                .map((word, index) => {
                  return (index ? ", " : "") + word.unicode;
                })}
              <p>Average Score: {Math.floor(avgScore * 100)}</p>
            </div>
            <div className="session-buttons">
            <button
              onClick={() => {
                navigate(`/`);
              }}
            >
              Return to Home
            </button>
            {/* Or
            <button onClick={() => {}}>New Study Session</button> */}
            </div>
          </div>
        </WideModal>
      ) : (
        <>
          <p style={{marginBottom:"5px"}}>Kanji Complete: {currentCharacterIndex}/{characterSessionData.length}</p>
          <LearnCard character={currentCharacter} learn={learn} handleAdvance={handleAdvance} />
        </>
      )}
    </div>
  );
};

export default LearnCardList;
