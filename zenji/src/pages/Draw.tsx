import React, { useRef } from "react";
import "../App.css";
import { ReactSketchCanvas } from "react-sketch-canvas";
import pathsToCoords from "../coord-utils/pathsToCoords";
import getTotalLengthAllPaths from "../coord-utils/getTotalLengthAllPaths";
import { useEffect } from "react";
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import ClearIcon from '@mui/icons-material/Clear';
import HighlightAltIcon from '@mui/icons-material/HighlightAlt';
import kanjiList from "../joyo_kanji.json";
import JSZip from 'jszip';
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

  // border: '1rem solid #9c9c9c',
  // borderRadius: '1rem',
};

const parser = new DOMParser();

function interpolate(inputSvg: any) {
  var doc = parser.parseFromString(inputSvg, "image/svg+xml");
  const svg = doc.getElementsByTagName("svg")[0];
  //console.log(svg);

  var paths = svg.getElementsByTagName("path");
  var coords: number[][][] = [];
  for (var i = 0; i < paths.length; i++) {
    coords[i] = pathsToCoords(
      [paths[i]],
      1,
      paths[i].getTotalLength() / 5,
      0,
      0
    );
  }
  var totalLengths = getTotalLengthAllPaths(paths);
  //console.log(coords);
  //console.log(totalLengths);
  return { coords, totalLengths };
}

function Draw(this: any) {
  const canvas: any = useRef<any>();
  const [svgHtml, setSvgHtml] = React.useState({ __html: '' });
  const [svg, setSvg] = React.useState<any>(null);
  const [displaySVG, setDisplaySVG] = React.useState<boolean>(false);
  const [kanji, setKanji] = React.useState<string>("何");

  const modifySVGColors = (inputSvg: any) => {
    var doc = new DOMParser().parseFromString(inputSvg, "image/svg+xml")
    //console.log("Here is the doc:", doc);
    const svgElement = doc.getElementsByTagName('svg')[0];

    if (!svgElement) {
      console.error("SVG element not found in the parsed document.");
    }

    //svg size (have to change both equally)
    svgElement.setAttribute('width', '300px');
    svgElement.setAttribute('height', '300px');

    //temporary colors (33)
    const colors = [
      "#FF5733", "#33FF57", "#3357FF", "#F333FF", "#FF3333", "#33FFFF",
      "#FFD700", "#FF69B4", "#8A2BE2", "#00FF7F", "#DC143C", "#00008B",
      "#008B8B", "#B8860B", "#A9A9A9", "#006400", "#BDB76B", "#8B008B",
      "#556B2F", "#FF8C00", "#9932CC", "#8B0000", "#E9967A", "#8FBC8F",
      "#483D8B", "#2F4F4F", "#00CED1", "#9400D3", "#FF1493", "#00BFFF",
      "#696969", "#1E90FF", "#B22222"
    ];
    
    var paths = svgElement.getElementsByTagName('path');

    for (var i = 0; i < paths.length; i++) {
      paths[i].setAttribute("stroke", colors[i % colors.length]);
    }

    return new XMLSerializer().serializeToString(svgElement);
  }

  const interpolate_stored = async () => {
    const zip = new JSZip();
  
    for (var i = 0; i < kanjiList.length; i++) {
      const svgModule = await fetch('/joyo_kanji/' + kanjiList[i] + '.svg');
      const svgText = await svgModule.text();
      const modifiedSvg = modifySVGColors(svgText);
  
      const { coords, totalLengths } = interpolate(modifiedSvg);
  
      // Convert data to JSON format
      const data = JSON.stringify({ coords, totalLengths }, null, 2);
  
      // Add the JSON data to the zip folder
      zip.file(kanjiList[i] + '.json', data);
      console.log("Added " + kanjiList[i] + " to the zip file.");
    }
  
    // Generate the zip file
    zip.generateAsync({ type: 'blob' })
      .then((blob) => {
        // Create a URL for the blob
        const url = window.URL.createObjectURL(blob);
  
        // Create a link element
        const link = document.createElement('a');
        link.href = url;
        link.download = 'interpolation_data.zip'; // Change the filename as needed
  
        // Append the link to the body
        document.body.appendChild(link);
  
        // Click the link to trigger download
        link.click();
  
        // Remove the link from the body
        document.body.removeChild(link);
      })
      .catch((error) => {
        console.error('Error generating zip file:', error);
      });
  };

  useEffect(() => {
    const loadSvg = async (unicode: string) => {
      // Load SVG dynamically
      try {
        const svgModule = await fetch('/joyo_kanji/' + unicode + '.svg');
        const svgText = await svgModule.text();
        const modifiedSvg = modifySVGColors(svgText);

        setSvgHtml({ __html: modifiedSvg });
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
          style={{width: '99%', height: '99%', borderRadius: '10px'}}
          strokeWidth={7}
          strokeColor="rgba(40, 40, 41, .75)"
          canvasColor="rgba(214, 90, 181, 0.01)"
        />
        {displaySVG && <div dangerouslySetInnerHTML={svgHtml} style={styles.svg} />}
        <button
          className="save-kanji"
          style={styles.button}
          onClick={() => {
            canvas.current
              .exportSvg()
              .then((data: any) => {
                interpolate(data);
              })
              .catch((e: any) => {
                console.log(e);
              });
          }}
        >
          <SaveAltIcon></SaveAltIcon>
        </button>
        <button 
          className="clear-kanji"
          style={styles.button}
          onClick={() => {
            canvas.current.clearCanvas();
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
        <button
          className="interpolate-kanji"
          style={styles.button}
          onClick={() => {
            interpolate_stored();
          }}
        >
          <HighlightAltIcon></HighlightAltIcon>
        </button>
      </div>
    </div>
  );
}

export default Draw;
