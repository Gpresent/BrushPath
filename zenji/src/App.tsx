import React, { useRef } from 'react';
import './App.css';
import Draw from './pages/Draw';

const styles = {
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

function App(this: any) {
  const canvas: any = useRef<any>();
  return (
    <div className="App" style={styles.container}>
      <Draw />
    </div>
  );
}

export default App;
