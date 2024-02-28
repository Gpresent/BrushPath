import React from 'react';
import '../styles/styles.css'

import { BsPerson } from "react-icons/bs";

const Header: React.FC = () => {
  const handleEditProfile = () => {
    console.log('clicked profile');
  };

  return (
    <div className = "header-wrapper">
    <div className="header">
        <div className="settingsButton"></div>
        <div className="title">Zenji</div>
        <BsPerson className="settingsButton" onClick={handleEditProfile}></BsPerson>
    </div>
    </div>
  );
};

export default Header;