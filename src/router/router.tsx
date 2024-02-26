import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DictionaryView from '../pages/Dictionary';
import Home from '../pages/Home';
import Draw from '../pages/Draw';
import Layout from '../Layout'
const ComponentRouter: React.FC = () => {
    return (
        <Layout>
            <BrowserRouter>
                <Routes>
                    <Route path="/home/:user" element={<Home message={'Welcome Back'} user={"Bart"}/>}></Route>
                    <Route path="/draw" element={<Draw/>}></Route>
                    <Route path="/dictionary" element={<DictionaryView title={'TEST'}/>} />
                </Routes>
            </BrowserRouter>
        </Layout>
    );
};

export default ComponentRouter;