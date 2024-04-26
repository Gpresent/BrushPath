import React, { useMemo, useState } from "react";
import KanjiGrade from "../types/KanjiGrade";
import "../styles/dict.css";
import "../styles/feedback.css";
import { useEffect } from "react";
import { gradeToWord } from "../utils/gradeToColor";
import ArrowForward from "@mui/icons-material/ArrowForward";
import Character from "../types/Character";
import ReplayIcon from '@mui/icons-material/Replay';

interface feedbackProps {
  kanjiGrade: KanjiGrade;
  attempts: (KanjiGrade & { hint: boolean })[];
  character: Character;
  setAllowDisplay: React.Dispatch<React.SetStateAction<boolean>>;
  setDisplaySVG: React.Dispatch<React.SetStateAction<boolean>>;
  allowDisplay: boolean;

  passing: number;
  color: string;
  recall: boolean;
  learn: boolean;
  handleAdvance?: (arg0: Character, arg1: KanjiGrade) => void;
  handleComplete?: (arg0: Character, arg1: KanjiGrade) => void;
  clearKanji?: () => void;
  displayRetryWithHintButton:boolean;
  displayRetryWithoutHintButton:boolean;

}

function pageCreator(feedback: string, index: number) {
  const sentences = feedback.split("\n");

  return (
    <div className="feedback" key={index}>
      <div className="feedback-box-strokes">
        <div style={{ fontWeight: "500" }}>
          {sentences[0].slice(0, sentences[0].indexOf(":"))}
        </div>
        {sentences.map((sentence, sentenceIndex) => {
          if (sentence.trim() === "") return null;
          if (sentenceIndex === 0) {
            return;
          }
          return (
            <div key={sentenceIndex + "_" + index}>&#x2022; {sentence}</div>
          );
        })}
      </div>
    </div>
  );
}

const Feedback: React.FC<feedbackProps> = (props) => {
  const kanji_grade = props.kanjiGrade;
  const color = props.color;
  const passing = props.passing;
  const canvasElement = document.getElementById("react-sketch-canvas");
  const [showDots, setShowDots] = useState(false);
  const [gradeInfo, setGradeInfo] = React.useState(false);
  const [haveGradeInfo, setHaveGradeInfo] = React.useState(true);
  const [grade, setGrade] = useState<KanjiGrade | null>(null);
  const [allowDisplay, setAllowDisplay] = useState<boolean>(false);
  const [childIndex, setChildIndex] = useState(0);
  const [pagenumber, setPageNumber] = useState(0);
  const [currentStroke, setCurrentStroke] = useState(-1);
  const [currentStrokeColor, setCurrentStrokeColor] = useState("black");

  useEffect(() => {
    let nextIndex = 0;
    for (let i = 0; i < childIndex; i++) {
      while (kanji_grade.grades[nextIndex] > passing || kanji_grade.grades[nextIndex] <= -1) nextIndex++;
      nextIndex++;
    }
    nextIndex--;
    const nextStroke = canvasElement?.getElementsByTagName("path")[nextIndex];
    const currStroke = canvasElement?.getElementsByTagName("path")[currentStroke];
    currStroke?.setAttribute("stroke", currentStrokeColor);
    setCurrentStroke(nextIndex);
    setCurrentStrokeColor(nextStroke?.getAttribute("stroke") || "black");
    const flashColor = nextStroke?.getAttribute("stroke") || "black";
    if (childIndex !== 0) {
      nextStroke?.setAttribute("stroke", "rgba(255, 55, 221, 0.8)");
      setTimeout(() => {
        nextStroke?.setAttribute("stroke", flashColor);
      }, 200)
      setTimeout(() => {
        nextStroke?.setAttribute("stroke", "rgba(255, 55, 221, 0.8)");
      }, 400)
    }
  }, [childIndex]);

  


  const displayNextButton = useMemo(() => {
    //If not in recall mode (ex dictionary page), don't show button
    // if (!props.recall) {
    //   return false;
    // }

    //Learn Mode
    if (props.learn && !props.recall) {

      if (props.attempts.filter((grade) => grade.overallGrade >= 65 && !grade.hint).length > 0) {

        return props.kanjiGrade
      }
    }
    //Review Mode
    else {
      if (props.attempts.filter((grade) => grade.overallGrade >= 65 && !grade.hint).length > 0) {

        return props.kanjiGrade
      }
    }

  }, [props])
  // console.log(kanji_grade);

  useEffect(() => {
    const handleScroll = () => {
      const container = document.querySelector(".feedback-container") as HTMLElement;
      if (!container) return;

      const scrollLeft = container.scrollLeft;
      const children = Array.from(container.children) as HTMLElement[];

      // Find the index of the child element that is currently snapped to
      let snappedIndex = -1;
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        const childScrollLeft = child.offsetLeft - container.offsetLeft;
        const childWidth = child.offsetWidth;
        if (Math.abs(scrollLeft - childScrollLeft) < childWidth / 10) {
          snappedIndex = i;
          break;
        }
      }
      if (snappedIndex >= 0)
        setChildIndex(snappedIndex);
    };

    const container = document.querySelector(".feedback-container");
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  useEffect(() => {
    let hasInfo = false;
    let pages = kanji_grade.grades.filter((value) => value < passing && value >= 0).length;
    if (pages !== pagenumber) setPageNumber(pages)
    setChildIndex(0)
    document.querySelectorAll(".feedback-container").forEach((container) => {
      container.scrollTo({ left: 0, behavior: "smooth" });
    });
    kanji_grade.grades.forEach((grade, index) => {
      if (
        grade >= passing ||
        grade <= -1 ||
        kanji_grade.feedback.length <= index
      )
        return;
      // return null;
      const path = canvasElement?.getElementsByTagName("path")[index];
      if (!path) return;

      // setShowDots(true);
      hasInfo = true;
      return;
    });
    // setHaveGradeInfo(hasInfo);
    setShowDots(hasInfo);
  }, [kanji_grade.grades]);

  return (
    <>
      {pagenumber > 0 && (
        <div className="page-dots-container">
          {[...Array(pagenumber + 1)].map((_, index) => (
            <div
              key={index}
              className={`page-dot ${childIndex === index ? "page-dot-active" : "page-dot-inactive"
                }`}
              style={{ width: `${100 / (pagenumber + 1)}%` }}
            ></div>
          ))}
        </div>
      )}
      <div className="feedback-container">
        <div className="feedback-header">
          {kanji_grade.overallGrade != -1 && (
            <div className="feedback-box">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  alignSelf: "start",
                  width: "100%",
                  justifyContent: "space-between"
                }}
              >

                <div style={{
                  display: "flex",
                  alignItems: "center",
                }}>
                  <div
                    className="grade-circle"
                    style={{ backgroundColor: color }}
                  >
                    {Math.round(kanji_grade.overallGrade)}
                  </div>

                  <div className="score-overview">
                    <div className="your-score">Your Score:</div>
                    <div className="feedback-word">
                      {gradeToWord(Math.round(kanji_grade.overallGrade))}
                    </div>


                  </div>

                </div>

                {(props.learn || props.recall) && props.displayRetryWithHintButton && (
                  <button
                    onClick={() => {

                      props.clearKanji!()
                    }}
                    className="learn-card-nav-right"
                  >
                    <ReplayIcon />
                  </button>
                )}
                {(props.learn || props.recall) && props.displayRetryWithoutHintButton && (
                  <button
                    onClick={() => {

                      props.clearKanji!()
                    }}
                    className="learn-card-nav-right"
                  >
                    <ArrowForward />
                  </button>
                )}
                {displayNextButton && (
                  <button
                    onClick={() => {

                      if (props.learn && !props.recall) {
                        props.setDisplaySVG(true);
                      }
                      else {
                        props.setAllowDisplay(false);

                      }
                      if (props.clearKanji) props.clearKanji()
                      props.handleAdvance!(props.character, kanji_grade)
                      setGrade(null);
                    }}
                    className="learn-card-nav-right"
                  >
                    <ArrowForward />
                  </button>
                )}

              </div>
              {kanji_grade.overallFeedback && (
                <div className="feedback-text">
                  {kanji_grade.overallFeedback}
                </div>
              )}
            </div>
          )}
        </div>
        {haveGradeInfo && (kanji_grade.overallFeedback || kanji_grade.grades.filter((value) => value < passing).length > 0) && (
          <>
            {kanji_grade.grades.map((grade, index) => {
              const extras = kanji_grade.grades.filter((value, eIndex) => value <= -1 && eIndex < index).length
              index -= extras
              if (
                grade >= passing ||
                grade < 0 ||
                kanji_grade.feedback.length <= index
              )
                return null;
              const path =
                canvasElement?.getElementsByTagName("path")[index];
              if (!path) return null;
              return pageCreator(kanji_grade.feedback[index], index);
            })}
          </>
        )}
      </div>
    </>
  );
};

export default Feedback;
