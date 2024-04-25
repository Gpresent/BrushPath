import React, { MutableRefObject, useContext, useLayoutEffect, useRef, useState } from "react";
import "../styles/App.css";
import { ReactSketchCanvas } from "react-sketch-canvas";
import { useEffect } from "react";
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import ClearIcon from '@mui/icons-material/Clear';
import DoneIcon from '@mui/icons-material/Done';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import grade from "../grading/grade_controller";
import '../styles/styles.css'
import Character from "../types/Character";
import KanjiGrade from "../types/KanjiGrade";
import { interpretImage } from "../recogition/interpretImage";
import type PredictionResult from "../recogition/predictionDisplay";
import { AuthContext } from "../utils/FirebaseContext";
import { upsertCharacterScoreData } from "../utils/FirebaseQueries";
import Feedback from "../grading/Feedback";
import gradeToColor from "../utils/gradeToColor";
import { DocumentData } from "@firebase/firestore";


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
  character?: Character;
  handleComplete?: (arg0: Character, arg1: KanjiGrade) => void;
  allowDisplay: boolean;
  handleAdvance?: (arg0: Character, arg1: KanjiGrade) => void;
  recall: boolean;
  learn?: boolean;
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
  const { userData, getUserData } = useContext(AuthContext);
  const canvas: any = useRef<any>();
  const [svgHtml, setSvgHtml] = React.useState({ __html: "" });
  const [inputStrokes, setInputStrokes] = React.useState<number>(0);
  const [displaySVG, setDisplaySVG] = React.useState<boolean>(props.learn || false);
  const [readOnly, setReadOnly] = React.useState<boolean>(false);
  const [kanji, setKanji] = React.useState<string>("何");
  const [askInput, setAskInput] = React.useState<boolean>(true);
  const [showStrokeGuide, setStrokeGuide] = React.useState<boolean>(true);
  const [allowDisplaySVG, setAllowDisplaySVG] = React.useState<boolean>(props.allowDisplay);
  const [kanji_grade, setKanjiGrade] = React.useState<KanjiGrade>({
    overallGrade: -1,
    overallFeedback: "",
    grades: [],
    feedback: [],
    strokeInfo: [],
  });

  const [attempts, setAttempts] = React.useState<(KanjiGrade & {hint: boolean})[]>([]);

  function clearKanji() {
    canvas.current.clearCanvas();
    setReadOnly(false);
    setKanjiGrade({
      overallGrade: -1,
      overallFeedback: "",
      grades: [],
      feedback: [],
      strokeInfo: [],
    });
  }



  const handleUpsertCharacterScoreData = async (characterID: string, grade: number) => {
    if (!userData) {
      const buffer = async () => {

      }
      buffer().then(() => {
        if (userData) {
          upsertCharacterScoreData((userData as DocumentData)?.email || "", characterID, grade);
        }

      });
    }
    else {
      upsertCharacterScoreData(userData?.email, characterID, grade);
    }


  }



  const checkStrokeNumber = () => {
    const canvasElement = document.getElementById("react-sketch-canvas");
    const paths = canvasElement?.getElementsByTagName("path").length;
    setInputStrokes(paths || 0);
  };

  const [color, setColor] = React.useState("rgba(0,0,0,0)");

  useEffect(() => {
    setColor(gradeToColor(kanji_grade.overallGrade))
  }, [kanji_grade])


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

        var svgText;
        if(character?.svg)  {
          svgText = character?.svg
        }
        else {
          const svgModule = await fetch("/joyo_kanji/" + unicode + ".svg");
          svgText = await svgModule.text();
        }
        var doc = parser.parseFromString(svgText, "image/svg+xml");
        const svg = doc.getElementsByTagName("svg")[0];
        svg.setAttribute("width", "100%");
        svg.setAttribute("height", "100%");
        const paths = svg.getElementsByTagName("path");
        var circles = svg.getElementsByTagName("circle");
        checkStrokeNumber();
        while (circles.length > 0) {
          circles[0].remove();
        }
        for (var i = 0; i < paths.length; i++) {
          paths[i].setAttribute("stroke", "rgba(140, 140, 241, .75)");
          paths[i].setAttribute("stroke-width", "3");

          if (showStrokeGuide && i === inputStrokes) {
            const startDot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            const startPosition = paths[i].getPointAtLength(0);
            startDot.setAttribute("cx", startPosition.x.toString());
            startDot.setAttribute("cy", startPosition.y.toString());
            startDot.setAttribute("r", "4");
            startDot.setAttribute("fill", "rgba(0, 246, 156, 0.75)");
            svg.appendChild(startDot);

            const endDot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            const pathLength = paths[i].getTotalLength();
            const endPosition = paths[i].getPointAtLength(pathLength);
            endDot.setAttribute("cx", endPosition.x.toString());
            endDot.setAttribute("cy", endPosition.y.toString());
            endDot.setAttribute("r", "4");
            endDot.setAttribute("fill", "rgba(246, 0, 0, 0.75)"); // Change color as needed
            svg.appendChild(endDot);
          }
        }
        const nums = svg.getElementsByTagName("text");
        for (var i = 0; i < nums.length; i++) {
          nums[i].setAttribute("fill", "rgba(140, 140, 241, .75)");
        }
        if (inputStrokes < nums.length) {
          while (nums.length > 0) {
            nums[0].remove();
          }
        }
        svgText = svg.outerHTML;

        setSvgHtml({ __html: svgText });
      } catch (e) { }
    };
    // const unicode = kanji?.codePointAt(0)?.toString(16).padStart(5, '0') || '';
    const unicode = props.character?.unicode_str
      ? props.character?.unicode_str
      : "";
    loadSvg(unicode);
  }, [kanji, inputStrokes]);

  useEffect(() => {
    const checkDarkMode = () => {
      setStrokeColor(document.body.classList.contains('dark-mode') ? 'rgba(224, 224, 224, .75)' : 'rgba(40, 40, 41, .75)');
    };

    checkDarkMode();
    checkStrokeNumber();

    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const canvas = document.getElementById("react-sketch-canvas");
    canvas?.addEventListener("touchstart", (e) => {
      e.preventDefault();
    }, { passive: false });
  }, []);

  const handleAdvance = (character: Character, grade: KanjiGrade) => {
    setAttempts([]);
    if (props.handleAdvance) {
      props.handleAdvance(character, grade);
    }


  }

  useEffect(() => {
    // This function will be called whenever someProp changes
    // Perform any necessary actions here
    // Example: setState(...)

    setAllowDisplaySVG(props.allowDisplay)
  }, [props.allowDisplay]);

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

      <div className="canvas" onMouseUp={checkStrokeNumber} onTouchEnd={checkStrokeNumber}>
        <div className="canvas-color" style={{ border: `7px solid ${color}`, opacity: '.5' }}></div>
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
            setInputStrokes(0);
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
            {displaySVG ? <VisibilityOffIcon fontSize="medium" /> : <VisibilityIcon fontSize="medium" />}
          </button>
        )}
        {kanji_grade.overallGrade !== -1 ?
          <button
            className="check-kanji"
            style={styles.button}
            onClick={() => {
              canvas.current.clearCanvas();
              setInputStrokes(0);
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
            <AutorenewIcon fontSize="medium" />
          </button>
          :
          <button
            className="check-kanji"
            style={styles.button}
            onClick={() => {
              if (document.getElementById("react-sketch-canvas")?.getElementsByTagName("path").length) {
                setReadOnly(true);
                canvas.current.exportSvg().then((data: any) => {

                  const convertCoords = (coords: any) => {
                    let coordsArr: any[] = []
                    Object.keys(coords).map((key: string) => parseInt(key)).sort((a, b) => a - b).forEach((coordKey) => {
                      coordsArr.push(coords[coordKey].map((coordsSet: { x: number, y: number }) => [coordsSet.x, coordsSet.y]))
                    })
                    return coordsArr;
                  }
                  const startTime = performance.now();
                  grade(data, kanji, passing, convertCoords(character?.coords), character?.totalLengths).then((grade: KanjiGrade) => {

                setKanjiGrade(grade)
                  setAttempts((prevAttempts) => {
                    const attempts =  [...prevAttempts,{...grade, hint: allowDisplaySVG}]
                    if(props.learn) {
                      const some = attempts.some((grade) => grade.overallGrade > 65 && !grade.hint)
                      if(!some) {
                        if(allowDisplaySVG) {
                          if(grade.overallGrade > 65) {
                            setAllowDisplaySVG(false)
                            setDisplaySVG(false)
                          }
                          
                        }
                        else {
                          setAllowDisplaySVG(true)
                          setDisplaySVG(true)
                        }
                      }
                      else {
                        setAllowDisplaySVG(true)
                        setDisplaySVG(true)
                      }
                        
                        
                      
                     
                      
                    }
                    return attempts
                  } )
                  //If in learn mode, hide svg on second attempt
                  

                  if(props.character) {
                    if(props.handleComplete) {
                      props.handleComplete(props.character,grade)
                    }
                    if(props.character.unicode_str) {
                      handleUpsertCharacterScoreData(props.character.unicode_str, grade.overallGrade)
                    }
                    else {
                      console.log("Character score not saved..")
                    }
                    
                  }
                  
                  
                  if (grade.overallGrade < 65 || grade.overallGrade === -1 || !grade.overallGrade) {
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
                    console.error(e);
                  });
                  const endTime = performance.now();
                  console.log("Time taken:", endTime - startTime, "ms");
                });
              }
            }}
          >
            <DoneIcon fontSize="medium" />
          </button>
        }
      </div>
      <Feedback setDisplaySVG={setDisplaySVG} setAllowDisplay={setAllowDisplaySVG} clearKanji={clearKanji} allowDisplay={allowDisplaySVG} attempts={attempts} recall={props.recall} learn={props.learn || false} character={props.character!} handleAdvance={handleAdvance} handleComplete={props.handleComplete} kanjiGrade={kanji_grade} passing={passing} color={color} />
    </div>

  );
};

export default Draw;