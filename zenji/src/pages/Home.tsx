import React from 'react';
import '../styles.css'
import HomeStats from '../components/HomeStats';

interface HomeProps {
    message: string;
    user: string;
}

const Home: React.FC<HomeProps> = ( props ) => {
  return (
    <div className="home-page">
        <h2 className="home-greeting">{props.message}, {props.user}</h2>
        <HomeStats/>
        <div>Wow. this homepage is so awesome</div>
    </div>
  );
};

export default Home;