import React, { useRef } from "react";
import "../App.css";
import { ReactSketchCanvas } from "react-sketch-canvas";
import { useEffect } from "react";
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ClearIcon from '@mui/icons-material/Clear';
import color_input from "../grading/color_input";
import grade_svg from "../grading/grade_svg";
import "../styles.css";


const styles = {
  canvas: {
    position: "relative" as "relative",
    width: '100%',
    aspectRatio: '1/1',
    maxWidth: '500px',
    display: "flex",
    border: '1px solid rgba(0, 0, 0, 1)',
    borderRadius: '10px',
    marginTop: '10px',
    marginBottom: '10px',
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  button: {
    borderWidth: "0px",
    padding: "0px",
    backgroundColor: "transparent",
  },
  container: {
    display: "flex",
    flexDirection: "column" as "column",
    justifyContent: "space-between",
    // alignItems: "center",
    height: "100%",
    width: "100%",
  },
  svg: {
    position: "absolute" as "absolute",
    zIndex: -1,
    opacity: .75,
  },
  gradeSvg: {
    position: "absolute" as "absolute",
    zIndex: 1,
    opacity: 1,
  }

  // border: '1rem solid #9c9c9c',
  // borderRadius: '1rem',
};

const parser = new DOMParser();

function Draw(this: any) {
  const canvas: any = useRef<any>();
  const [svgHtml, setSvgHtml] = React.useState({ __html: '' });
  const [displaySVG, setDisplaySVG] = React.useState<boolean>(false);
  const [readOnly, setReadOnly] = React.useState<boolean>(false);
  const [kanji, setKanji] = React.useState<string>("何");

  useEffect(() => {
    const loadSvg = async (unicode: string) => {
      // Load SVG dynamically
      try {
        const svgModule = await fetch('/joyo_kanji/' + unicode + '.svg');
        var svgText = await svgModule.text();
        var doc = parser.parseFromString(svgText, "image/svg+xml");
        const svg = doc.getElementsByTagName("svg")[0];
        svg.setAttribute("width", "100%");
        svg.setAttribute("height", "100%");
        const paths = svg.getElementsByTagName("path");
        for (var i = 0; i < paths.length; i++) {
          paths[i].setAttribute("stroke", "rgba(140, 140, 241, .75)");
        }
        const nums = svg.getElementsByTagName("text");
        while (nums.length > 0) {
          nums[0].remove();
        }
        svgText = svg.outerHTML;

        setSvgHtml({ __html: svgText });
      } catch (e) {

      }
    };
    const unicode = kanji?.codePointAt(0)?.toString(16).padStart(5, '0') || '';

    loadSvg(unicode);
  }, [kanji]);

  return (
    <div style={styles.container}>
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
      <div style={styles.canvas}>
        <ReactSketchCanvas
          ref={canvas}
          style={{width: '99%', height: '99%', borderRadius: '10px', pointerEvents: readOnly ? 'none' : 'auto'}}
          strokeWidth={7}
          strokeColor="rgba(40, 40, 41, .75)"
          canvasColor="rgba(214, 90, 181, 0.01)"
        />
        {displaySVG && <div dangerouslySetInnerHTML={svgHtml} style={styles.svg} />}
        <button 
          className="clear-kanji"
          style={styles.button}
          onClick={() => {
            canvas.current.clearCanvas();
            setReadOnly(false);
          }}
        >
          <ClearIcon></ClearIcon>
        </button>
        <button
          className="view-kanji"
          style={styles.button}
          onClick={() => {
            setDisplaySVG(!displaySVG);
          }}
        >
          {displaySVG ? <VisibilityOffIcon/> : <VisibilityIcon/>}
        </button>
      </div>
      <button
        className="recolor-canvas"
        onClick={() => {
          setReadOnly(true);
          canvas.current.exportSvg().then((data: any) => {
          grade_svg(data, kanji);
        }).catch((e: any) => {
          console.log(e);
        })}}
        >
          Grade SVG
        </button>
    </div>
  );
}

export default Draw;
