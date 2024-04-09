import React, { useLayoutEffect, useRef, useState } from "react";
import "../styles/App.css";
import { ReactSketchCanvas } from "react-sketch-canvas";
import { useEffect } from "react";
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ClearIcon from '@mui/icons-material/Clear';
import DoneIcon from '@mui/icons-material/Done';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import grade from "../grading/grade_controller";
import '../styles/styles.css'
import Character from "../types/Character";
import KanjiGrade from "../types/KanjiGrade";
import { interpretImage } from "../recogition/interpretImage";
import type PredictionResult from "../recogition/predictionDisplay";
import Feedback from "../grading/Feedback";


const passing = 0.65;

const styles = {
  button: {
    borderWidth: "0px",
    padding: "10px",
    backgroundColor: "transparent",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    display: "flex",
    flexDirection: "column" as "column",
    justifyContent: "space-between",
    // alignItems: "center",
    height: "100%",
    width: "100%",
    maxWidth: "500px",
  },
  svg: {
    position: "absolute" as "absolute",
    zIndex: -1,
    opacity: 0.75,
  },
  gradeSvg: {
    position: "absolute" as "absolute",
    zIndex: 1,
    opacity: 1,
  },

  // border: '1rem solid #9c9c9c',
  // borderRadius: '1rem',
};

const parser = new DOMParser();

interface DrawProps {
  character: Character;
  allowDisplay: boolean;
}
// Define types for coordinates
interface Point {
  x: number;
  y: number;
}

// Function to calculate the coordinates relative to the canvas
function calculateIconPosition(canvasRect: DOMRect, path: SVGPathElement, index: number): Point {
  const location = path.getPointAtLength(path.getTotalLength() / 2);
  const offsetX = (canvasRect.left + window.scrollX);
  const offsetY = (canvasRect.top + window.scrollY);
  return { x: offsetX, y: offsetY };
}

const Draw: React.FC<DrawProps> = (props) => {
  const canvas: any = useRef<any>();
  const canvasElement = document.getElementById("react-sketch-canvas");
  const [svgHtml, setSvgHtml] = React.useState({ __html: "" });
  const [displaySVG, setDisplaySVG] = React.useState<boolean>(false);
  const [readOnly, setReadOnly] = React.useState<boolean>(false);
  const [kanji, setKanji] = React.useState<string>("何");
  const [askInput, setAskInput] = React.useState<boolean>(true);
  const [allowDisplaySVG, setAllowDisplaySVG] = React.useState<boolean>(props.allowDisplay);
  const [kanji_grade, setKanjiGrade] = React.useState<KanjiGrade>({
    overallGrade: -1,
    overallFeedback: "",
    grades: [],
    feedback: [],
    strokeInfo: [],
  });

  const [prediction, setPrediction] = React.useState<PredictionResult[]>()
  const [strokeColor, setStrokeColor] = useState("rgba(40, 40, 41, .75)");

  let character = props.character

  useLayoutEffect(() => {
    if (props.character) {
      setKanji(props.character.unicode);
      setAskInput(false);
    }
  });

  useEffect(() => {
    const loadSvg = async (unicode: string) => {
      // Load SVG dynamically
      try {
        const svgModule = await fetch("/joyo_kanji/" + unicode + ".svg");
        var svgText = await svgModule.text();
        var doc = parser.parseFromString(svgText, "image/svg+xml");
        const svg = doc.getElementsByTagName("svg")[0];
        svg.setAttribute("width", "100%");
        svg.setAttribute("height", "100%");
        const paths = svg.getElementsByTagName("path");
        for (var i = 0; i < paths.length; i++) {
          paths[i].setAttribute("stroke", "rgba(140, 140, 241, .75)");
          paths[i].setAttribute("stroke-width", "3");
        }
        const nums = svg.getElementsByTagName("text");
        for (var i = 0; i < nums.length; i++) {
          nums[i].setAttribute("fill", "rgba(140, 140, 241, .75)");
        }
        // while (nums.length > 0) {
        //   nums[0].remove();
        // }
        svgText = svg.outerHTML;

        setSvgHtml({ __html: svgText });
      } catch (e) { }
    };
    // const unicode = kanji?.codePointAt(0)?.toString(16).padStart(5, '0') || '';
    const unicode = props.character?.unicode_str
      ? props.character?.unicode_str
      : "";
    loadSvg(unicode);
  }, [kanji]);

  useEffect(() => {
    const checkDarkMode = () => {
      setStrokeColor(document.body.classList.contains('dark-mode') ? 'rgba(224, 224, 224, .75)' : 'rgba(40, 40, 41, .75)');
    };

    checkDarkMode();

    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  return (
    <div style={styles.container}>
      {askInput && (
        <div className="kanji-input-wrapper">
          <p className="kanji-input-prompt">Enter Kanji to Practice:</p>
          <input
            className="kanji-input-typed"
            placeholder="Enter Kanji"
            onChange={(e) => {
              setKanji(e.target.value);
            }}
            value={kanji}
          />
        </div>
      )}
      <div className="canvas">
        <ReactSketchCanvas
          ref={canvas}
          style={{
            width: "99%",
            height: "99%",
            borderRadius: "10px",
            pointerEvents: readOnly ? "none" : "auto",
          }}
          strokeWidth={7}
          strokeColor={strokeColor}
          canvasColor="rgba(214, 90, 181, 0.01)"
        />
        {displaySVG && (
          <div dangerouslySetInnerHTML={svgHtml} style={styles.svg} />
        )}
        <button
          className="clear-kanji"
          style={styles.button}
          onClick={() => {
            canvas.current.clearCanvas();
            setReadOnly(false);
            setKanjiGrade({
              overallGrade: -1,
              overallFeedback: "",
              grades: [],
              feedback: [],
              strokeInfo: [],
            });
          }}
        >
          <ClearIcon fontSize="medium"></ClearIcon>
        </button>
        {allowDisplaySVG && (
          <button
            className="view-kanji"
            style={styles.button}
            onClick={() => {
              setDisplaySVG(!displaySVG);
            }}
          >
            {displaySVG ? <VisibilityOffIcon fontSize="medium"/> : <VisibilityIcon fontSize="medium"/>}
          </button>
        )}
          <button
          className="check-kanji"
          style={styles.button}
          onClick={() => {
            if (document.getElementById("react-sketch-canvas")?.getElementsByTagName("path").length) {
              setReadOnly(true);
              canvas.current.exportSvg().then((data: any) => {
                grade(data, kanji, passing).then((grade: KanjiGrade) => {
                  setKanjiGrade(grade);

                  if (grade.overallGrade < 65 || grade.overallGrade === -1 || !grade.overallGrade) {
                    //console.log(grade)
                    canvas.current.exportImage('jpeg').then((data: any) => {
                      interpretImage(data).then(result => {

                        setPrediction(result);
                        if (kanji === result?.[0]?.label) return;


                        if (grade.overallFeedback === "") {
                          setKanjiGrade(prevState => ({
                            ...prevState,
                            overallFeedback: grade.overallFeedback + "Looks like you might have written the kanji " + result?.[0]?.label ?? "No feedback available"
                          }));
                        }
                        else {
                          setKanjiGrade(prevState => ({
                            ...prevState,
                            overallFeedback: grade.overallFeedback + "Did you draw " + result?.[0]?.label + " instead?" ?? "No feedback available"

                          }));
                        }
                      }).catch(error => {
                        console.error('Error interpreting image:', error);
                      });
                    }).catch((e: any) => {
                      console.error(e);
                    });
                  }
                }).catch((e: any) => {
                  console.log(e);
                });
              });
            }
          }}
        >
          <DoneIcon fontSize="medium"/>
        </button>
      </div>
      <Feedback kanjiGrade={kanji_grade} passing={passing} />
    </div>

  );
};

export default Draw;