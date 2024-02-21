import React, { useRef } from 'react';
import '../App.css';
import { ReactSketchCanvas } from 'react-sketch-canvas';
import pathsToCoords from '../coord-utils/pathsToCoords';
import getTotalLengthAllPaths from '../coord-utils/getTotalLengthAllPaths';
import { useEffect } from 'react';

const styles = {
  canvas: {
    display: 'flex',
    height: '90vh',
    margin: '0px 50px',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  button: {
    borderWidth: '0px',
    padding: '0px',
    width: '100px',
    height: '50px',
    backgroundColor: 'black',
    color: 'white',
    borderRadius: '10px',
    // margin: '0px 50px',
  },
  container: {
    display: 'flex',
    flexDirection: 'column' as 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100vh',
    width: "100%",
  },
  svg: {
    position: 'absolute' as 'absolute',
    zIndex: 1,
    height: '40vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }
  
  // border: '1rem solid #9c9c9c',
  // borderRadius: '1rem',
};

const parser = new DOMParser();

function interpolate(inputSvg: any){
  var doc = parser.parseFromString(inputSvg, "image/svg+xml");
  const svg = doc.getElementsByTagName('svg')[0];
  console.log(svg);

  var paths = svg.getElementsByTagName('path');
  var coords: number[][][] = [];
  for (var i = 0; i < paths.length; i++) {

    coords[i] = pathsToCoords([paths[i]], 1, paths[i].getTotalLength() / 5, 0, 0);
  }
  var totalLengths = getTotalLengthAllPaths(paths);
  console.log(coords);
  console.log(totalLengths);
}

function Draw(this: any) {
  const canvas: any = useRef<any>();
  const [svg, setSvg] = React.useState<any>(null);
  const [displaySVG, setDisplaySVG] = React.useState<boolean>(false);
  const [kanji, setKanji] = React.useState<string>('何');

  useEffect(() => {
    const loadSvg = async (unicode: string) => {
      // Load SVG dynamically
      try {
        const svgModule = await import('../joyo_kanji/' + unicode + '.svg');
        setSvg(svgModule.default);
      } catch (e) {

      }
    };
    const unicode = kanji?.codePointAt(0)?.toString(16).padStart(5, '0') || '';

    loadSvg(unicode);
  }, [kanji]);
  
  return (
    <div style={styles.container}>
      <ReactSketchCanvas
      ref={canvas}
      style={styles.canvas}
      strokeWidth={7}
      strokeColor="#8a712d"
      canvasColor="rgba(214, 90, 181, 0.2)"
      
      />
      {displaySVG && <img src={svg} alt="kanji" style={{...styles.svg}} />}
      <div style={{display: 'flex', height: '10vh', justifyContent: 'space-between', alignItems: 'center', width: '100%'}}>
        <button style={styles.button}
          onClick={() => {
            canvas.current
              .exportSvg()
              .then((data:any) => {
                interpolate(data);
              })
              .catch((e:any) => {
                console.log(e);
              });
          }}
        >
          Get Image
        </button>
        <button style={styles.button}
          onClick={() => {
            canvas.current
              .clearCanvas()
          }}
        >
          Clear
        </button>
        <button style={styles.button}
          onClick={() => {
            setDisplaySVG(!displaySVG);
          }}
          >
            {displaySVG ? 'Hide Kanji' : 'Show Kanji'}
        </button>
        <input
          placeholder='Enter Kanji'
          style={{...styles.button, textAlign: 'center'}}
          onChange={(e) => {
            setKanji(e.target.value);
          }}
          value={kanji}
        />
      </div>
    </div>
  );
}

export default Draw;
