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
import LoadingBar from "../LoadingBar";

interface LearnCardListProps {
  characters: Character[];
  refetch?: (numCharacters?: number) => void;
  learn: boolean;
  recall: boolean;
}
type CharacterSessionData = Character & {
  score?: KanjiGrade;
};

const LearnCardList: React.FC<LearnCardListProps> = ({
  characters,
  refetch,
  learn,
  recall
}) => {
  const [currentCharacterIndex, setCurrentCharacterIndex] = useState<number>(0);
  // console.log("Recall:", recall, "Learn:", learn);
  const [characterSessionData, setCharacterSessionData] =
    useState<CharacterSessionData[]>(characters);

  const [finished, setFinished] = useState<boolean>(false);

  const [showSessionModal, setShowSessionModal] = useState<boolean>(false);
  const [showLearnModal, setShowLearnModal] = useState<boolean>(true);


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
  // useEffect(() => {
  //   //Build components

  // }, []);

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
          ? Math.max(...(char.score?.grades || [])) + accumulator
          : accumulator;
      }, 0) / scoredChars.length
    );
  }, [characterSessionData]);

  function onClose() {
    navigate(`/deck/${id}`);
    setShowSessionModal(false);
  }

  function onCloseLearn() {
    setFinished(true);
    navigate("/");
    setShowLearnModal(false);
  }

  const navigate = useNavigate();
  let { id } = useParams();

  //Todo, replace divs with actual tags lol
  return (
    <>
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
              <div>Learned {currentCharacterIndex} new characters: </div>
              <div>
                {characterSessionData
                  .filter((character) => {
                    return character.score !== undefined;
                  })
                  .map((word, index) => {
                    return (
                      (index ? ", " : "") +
                      word.unicode +
                      " (" +
                      word.one_word_meaning +
                      ")"
                    );
                  })}
              </div>
              <p>Average Score: {Math.floor(avgScore * 100) || 0}</p>
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
        <WideModal
          title={recall ? "Review Session" : "Learn Session"}
          isOpen={showLearnModal}
          onClose={onCloseLearn}
        >
          <div className="learn-container">
            <LoadingBar progress={currentCharacterIndex} duration={characterSessionData.length} message={""}></LoadingBar>

            <LearnCard
              character={currentCharacter}
              learn={learn}
              recall={recall}
              handleAdvance={handleAdvance}
            />
            {/* <div className="learn-card-nav-row">
            <p style={{ marginTop: "7.5px" }}>
              Kanji Completed: {currentCharacterIndex}/
              {characterSessionData.length}
            </p>
            <button
              onClick={() => {
                console.log("Session Done");
                setFinished(true);
                setShowSessionModal(true);
              }}
            >
              End Session
            </button>
          </div> */}

          </div>
        </WideModal>
      )}
    </>
  );
};

export default LearnCardList;
