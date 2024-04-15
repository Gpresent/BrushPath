import React, { useState } from "react";
import KanjiGrade from "../types/KanjiGrade";
import "../styles/dict.css";
import "../styles/feedback.css";
import { useEffect } from "react";
import { gradeToWord } from "../utils/gradeToColor";
import ArrowForward from "@mui/icons-material/ArrowForward";
import Character from "../types/Character";

interface feedbackProps {
  kanjiGrade: KanjiGrade;
  character: Character;
  passing: number;
  color: string;
  recall: boolean;
  handleAdvance?: (arg0: Character, arg1:KanjiGrade )=> void;
  handleComplete?: (arg0: Character, arg1: KanjiGrade) => void;
  clearKanji?: () => void;
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

  // console.log(kanji_grade);

  useEffect(() => {
    document.querySelectorAll(".feedback-container").forEach((container) => {
      container.addEventListener("scrollend", () => {
        const scrollLeft = container.scrollLeft;
        const children = Array.from(container.children) as HTMLElement[];
        const index = children.findIndex(
          (child) => child.offsetLeft > scrollLeft
        );
        setChildIndex(Math.floor(scrollLeft / container.clientWidth))
        console.log(childIndex)

        if (index !== -1) {
          

          const nextBoxLeft = children[index].offsetLeft;
          const prevBoxLeft = index > 0 ? children[index - 1].offsetLeft : 0;

          const targetLeft =
            scrollLeft - prevBoxLeft < nextBoxLeft - scrollLeft
              ? prevBoxLeft
              : nextBoxLeft;
          container.scrollTo({
            left: targetLeft,
            behavior: "smooth",
          });
        }
      });
    });
  }, []);

  useEffect(() => {
    let hasInfo = false;
    let pages = kanji_grade.grades.filter((value) => value < passing).length + 1
    if (pages != pagenumber) setPageNumber(pages)
    kanji_grade.grades.forEach((grade, index) => {
      if (
        grade >= passing ||
        grade === -1 ||
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
          {[...Array(pagenumber)].map((_, index) => (
            <div
              key={index}
              className={`page-dot ${
                childIndex === index ? "page-dot-active" : "page-dot-inactive"
              }`}
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
                  alignItems: "center",}}>
                <div
                  className="grade-circle"
                  style={{ backgroundColor: color }}
                >
                  {Math.round(kanji_grade.overallGrade)}
                </div>

                <div className="score-overview">
                  <div className="your-score">Your Score:</div>
                  <div className="feedback-word">
                    {gradeToWord(kanji_grade.overallGrade)}
                  </div>
                </div>
                </div>

                {kanji_grade && kanji_grade.overallGrade > 65 && props.recall && (
                  <button
                    onClick={() => {
                      setAllowDisplay(false);
                      if(props.clearKanji)  props.clearKanji() 
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
              if (
                grade >= passing ||
                grade === -1 ||
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
