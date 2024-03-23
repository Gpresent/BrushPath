import React, { useEffect, useState } from "react";
import { auth } from '../utils/Firebase';
import { signOut } from 'firebase/auth';
import "../styles/settings.css";
import { googleLogout } from "@react-oauth/google";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const SettingsView: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleToggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="settings-page">
      <div className="settings-block">

        <p className="title">Settings</p>
        <div className="settings-list">
          <div className="settings-item">
            <span>Username</span>
            <ArrowForwardIcon className="right-arrow"></ArrowForwardIcon>
          </div>
          <div className="settings-item">
            <span>Profile Picture</span>
            <ArrowForwardIcon className="right-arrow"></ArrowForwardIcon>
          </div>
        </div>

        <p className="title">Preferences</p>
        <div className="settings-list">
          <div className="settings-item">
            <span>Dark Mode</span>
            <div 
              id="toggleButton" 
              className={`toggle-button ${isDarkMode ? 'active' : ''}`} //if true/false, shorthand goes crazy
              onClick={handleToggleDarkMode}
            ></div>
          </div>
          <div className="settings-item">
            <span>Accessibility</span>
            <ArrowForwardIcon className="right-arrow"></ArrowForwardIcon>
          </div>
        </div>

        <p className="title">About</p>
        <div className="settings-list">
          <div className="settings-item">
            <span>Privacy Policy</span>
            <ArrowForwardIcon className="right-arrow"></ArrowForwardIcon>
          </div>
          <div className="settings-item">
            <span>Terms of Service</span>
            <ArrowForwardIcon className="right-arrow"></ArrowForwardIcon>
          </div>
          <div className="settings-item">
            <span>Contact Us</span>
            <ArrowForwardIcon className="right-arrow"></ArrowForwardIcon>
          </div>

        </div>
      </div>

      <button
        className="logout-button"
        onClick={async () => {
          await signOut(auth);
          googleLogout();
        }}
      >
        Sign Out
      </button>
    </div>
  );
};

export default SettingsView;
