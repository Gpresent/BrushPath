// import React, { useRef } from 'react';
import './App.css';
import Draw from './pages/Draw';
import DeckCard from './components/DeckCard';
import WordCard from './components/WordCard';
import Layout from './Layout';
import DictionaryView from './pages/Dictionary';
import Home from './pages/Home';
import DeckLanding from './pages/DeckLanding'
import SingleDeckView from './pages/SingleDeck';

import './styles/App.css';
// import Draw from './pages/Draw';
// import Layout from './Layout';
// import DictionaryView from './pages/Dictionary';
// import Home from './pages/Home';
import ComponentRouter from './router/router';
import { AuthProvider } from './utils/FirebaseContext';
 
function App(this: any) {
  return (
    <AuthProvider>
    <ComponentRouter/>
    </AuthProvider>
  );
}


// <Layout>
//   <Home message={'Welcome back'} user={'Charlotte'} />
//   <Draw />
//   <DictionaryView title={"My Words"} />
// </Layout>

export default App;
