// import React, { useRef } from 'react';
import './App.css';
import Draw from './pages/Draw';
import DeckCard from './components/DeckCard';
import WordCard from './components/WordCard';
import Layout from './Layout';
import DictionaryView from './pages/Dictionary';
import Home from './pages/Home';
import { AuthProvider } from './utils/FirebaseContext';
import SamButtons from './components/SamButtons';

 
function App(this: any) {
  return (
    <AuthProvider>
    <Layout>
      <SamButtons />
      <Draw />
      <DictionaryView title={"My Words"} />
    </Layout>
    </AuthProvider>
  );
}

export default App;
