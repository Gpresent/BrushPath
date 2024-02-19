import React, { useRef } from 'react';
import '../App.css';
import { ReactSketchCanvas } from 'react-sketch-canvas';
import pathsToCoords from '../coord-utils/pathsToCoords';
import getTotalLengthAllPaths from '../coord-utils/getTotalLengthAllPaths';

const styles = {
  canvas: {
    display: 'flex',
    height: '90vh',
    margin: '0px 50px',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: '100px',
    height: '50px',
    backgroundColor: 'red',
    color: 'white',
    borderRadius: '10px',
    margin: '0px 50px',
  },
  container: {
    display: 'flex',
    flexDirection: 'column' as 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    width: "100%",
  },
  
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
  return (
    <div style={styles.container}>
      <ReactSketchCanvas
      ref={canvas}
      style={styles.canvas}
      strokeWidth={5}
      strokeColor="#8a712d"
      canvasColor="#f5f5f5"
      
      />
      <div style={{display: 'flex', height: '10vh', justifyContent: 'center', alignItems: 'center'}}>
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
      </div>
    </div>
  );
}

export default Draw;
