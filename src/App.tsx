
import './styles/App.css';
// import Draw from './pages/Draw';
// import Layout from './Layout';
// import DictionaryView from './pages/Dictionary';
// import Home from './pages/Home';
import ComponentRouter from './router/router';
import { AuthProvider } from './utils/FirebaseContext';
import { CharacterProvider } from './utils/FBCharacterContext';
// import { CharacterSearchContext, CharacterSearchProvider } from './utils/CharacterSearchContext';

function App(this: any) {
  document.addEventListener('dragstart', function (event) {
    event.preventDefault();
  });

  return (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
      <AuthProvider>
        <CharacterProvider>
          {/* <CharacterSearchProvider> */}
          <ComponentRouter />
          {/* </CharacterSearchProvider> */}
        </CharacterProvider>
      </AuthProvider>
    </>
  );
}


// <Layout>
//   <Home message={'Welcome back'} user={'Charlotte'} />
//   <Draw />
//   <DictionaryView title={"My Words"} />
// </Layout>

export default App;
