import React from 'react';
import '../styles.css'; 
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';

const Header: React.FC = () => {
  const handleEditProfile = () => {
    console.log('clicked profile');
  };

  return (
    <div className="header">
        <div className="settingsButton"></div>
        <div className="title">Zenji</div>
        <PersonOutlineOutlinedIcon className="settingsButton" onClick={handleEditProfile}></PersonOutlineOutlinedIcon>
    </div>
  );
};

export default Header;