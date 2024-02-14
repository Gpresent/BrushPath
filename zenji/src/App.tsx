import React, { useRef } from 'react';
import logo from './logo.svg';
import './App.css';
import { ReactSketchCanvas } from 'react-sketch-canvas';

const styles = {
  display: 'flex',
  height: '90vh'
  // border: '1rem solid #9c9c9c',
  // borderRadius: '1rem',
};

function App(this: any) {
  const canvas: any = useRef<any>();
  return (
    <div className="App">
      
      <ReactSketchCanvas
      ref={canvas}
      style={styles}
      strokeWidth={4}
      strokeColor="red"
      
      />
      <button
        onClick={() => {
          canvas.current
            .exportSvg()
            .then((data:any) => {
              console.log(data);
            })
            .catch((e:any) => {
              console.log(e);
            });
        }}
      >
        Get Image
      </button>
      <button style={{marginLeft: '10px'}}
        onClick={() => {
          canvas.current
            .clearCanvas()
        }}
      >
        Clear
      </button>
    </div>
  );
}

export default App;
