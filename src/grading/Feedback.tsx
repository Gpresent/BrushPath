import React, { useMemo, useState } from "react";
import KanjiGrade from "../types/KanjiGrade";
import "../styles/dict.css";
import "../styles/feedback.css";
import { useEffect } from "react";
import { gradeToWord } from "../utils/gradeToColor";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ArrowForward from "@mui/icons-material/ArrowForward";
import Character from "../types/Character";

interface feedbackProps {
  kanjiGrade: KanjiGrade;
  attempts: KanjiGrade[];
  character: Character;
  setAllowDisplay: React.Dispatch<React.SetStateAction<boolean>>;
  setDisplaySVG: React.Dispatch<React.SetStateAction<boolean>>;

  passing: number;
  color: string;
  recall: boolean;
  learn: boolean;
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDots, setShowDots] = useState(false);
  const [gradeInfo, setGradeInfo] = React.useState(false);
  const [haveGradeInfo, setHaveGradeInfo] = React.useState(true);
  const [grade, setGrade] = useState<KanjiGrade | null>(null);
  

  const displayNextButton = useMemo(() => {
    //If not in recall mode (ex dictionary page), don't show button
    if(!props.recall) {
      return false;
    }

    //Learn Mode
    if(props.learn) {
      if(props.attempts.length > 1) {
        return props.kanjiGrade 
      }
    } 
    //Review Mode
    else {
      return props.kanjiGrade && props.kanjiGrade.overallGrade > 50 
    }
    
  },[props])
  // console.log(kanji_grade);

  useEffect(() => {
    document.querySelectorAll(".feedback-container").forEach((container) => {
      let isScrolling: ReturnType<typeof setTimeout>;

      container.addEventListener("scroll", () => {
        clearTimeout(isScrolling);
        isScrolling = setTimeout(() => {
          const scrollLeft = container.scrollLeft;
          const children = Array.from(container.children) as HTMLElement[];
          const index = children.findIndex(
            (child) => child.offsetLeft > scrollLeft
          );

          if (index !== -1) {
            // setCurrentIndex(index);

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
            // console.log("index is: " + currentIndex)
          }
        }, 50); // Adjust debounce delay as needed (in milliseconds)
      });
    });
  }, []);

  useEffect(() => {
    let hasInfo = false;
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
      <div>
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
                  {props.learn && props.attempts.length === 1 &&
                    <div className="feedback-word">
                    <strong>Try again without the kanji to continue</strong>
                  </div>
                  }
                </div>
                </div>
                
                
                {displayNextButton && (
                  <button
                    onClick={() => {
                      
                      if(props.learn) {
                        props.setDisplaySVG(true);
                      }
                      else {
                          props.setAllowDisplay(false);
                      
                      }
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

              {haveGradeInfo && (kanji_grade.overallFeedback || kanji_grade.grades.filter((value) => value < passing).length > 0) && (
                <div className="feedback-detail">
                  <div
                    className="grade-info-button"
                    onClick={() => {
                      // console.log("clicked");
                      setGradeInfo(!gradeInfo);
                      document
                        .getElementsByClassName("grade-info")[0]
                        ?.classList.toggle("info-hidden");
                    }}
                  >
                    {gradeInfo ? (
                      <>
                        {" "}
                        Less Feedback <ExpandLess fontSize="medium" />
                      </>
                    ) : (
                      <>
                        {" "}
                        More Feedback <ExpandMore fontSize="medium" />
                      </>
                    )}
                  </div>
                  <div className="grade-info info-hidden">
                    {kanji_grade.overallFeedback !== "" && (
                      <div>{kanji_grade.overallFeedback}</div>
                    )}
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
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div style={{ textAlign: "center", marginTop: "10px" }}>
        {showDots && (
          // <span
          //   style={{
          //     display: "inline-block",
          //     width: "10px",
          //     height: "10px",
          //     borderRadius: "50%",
          //     backgroundColor: 0 === currentIndex ? "blue" : "gray",
          //     margin: "0 5px",
          //   }}
          // />
          <></>
        )}
        {kanji_grade.grades.map((grade, index) => {
          if (
            grade >= passing ||
            grade === -1 ||
            kanji_grade.feedback.length <= index
          )
            return null;
          const path = canvasElement?.getElementsByTagName("path")[index];
          if (!path) return null;
          return (
            // <span
            //   key={index}
            //   style={{
            //     display: "inline-block",
            //     width: "10px",
            //     height: "10px",
            //     borderRadius: "50%",
            //     backgroundColor: index  === currentIndex ? "blue" : "gray",
            //     margin: "0 5px",
            //   }}
            // />
            <></>
          );
        })}
      </div>
    </>
  );
};

export default Feedback;
