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
};

function App(this: any) {
  return (
    <div className="App" style={styles.container}>
      <Draw />
    </div>
  );
}

export default App;
