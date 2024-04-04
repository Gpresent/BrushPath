import React, { useState } from "react";
import { auth } from '../utils/Firebase';
import { signOut } from 'firebase/auth';
import "../styles/settings.css";
import { googleLogout } from "@react-oauth/google";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import UsernameModal from '../components/UsernameModal';
import { useDarkMode } from '../components/DarkModeContext';
import PrivacyPolicyModal from '../components/PrivacyPolicyModal';

const SettingsView: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [showPrivacyPolicyModal, setShowPrivacyPolicyModal] = useState(false);

  const handleArrowClick = (spanName: string) => {
    // Perform different actions based on spanName
    switch (spanName) {
      case 'Username':
        setShowUsernameModal(true);
        break;
      case 'Profile Picture':
        console.log("Profile Picture Arrow Clicked")
        break;
      case 'Accessibility':
        console.log("Accessibility Arrow Clicked")
        break;
      case 'Privacy Policy':
        setShowPrivacyPolicyModal(true);
        break;
      case 'Terms of Service':
        console.log("Terms of Service Arrow Clicked")
        break;

      default:
        console.log("Nothing to see here people 0_0")
        break;
    }
  };

  const closePrivacyPolicyModal = () => {

    setShowPrivacyPolicyModal(false);
  };

  const closeUsernameModal = () => {
    setShowUsernameModal(false);
  };

  const handleUsernameSubmit = (newUsername: string) => {

    closeUsernameModal();
  };

  return (
    <div className="settings-page">
      <div className="settings-block">
        <p className="settings-title">Settings</p>
        <p className="title">Profile</p>

        <div className="settings-list">
          <div className="settings-item">
            <span onClick={() => handleArrowClick('Username')}>Username</span>
            <ArrowForwardIcon className="right-arrow" onClick={() => handleArrowClick('Username')} />
          </div>
          {/* <div className="settings-item">
            <span onClick={() => handleArrowClick('Profile Picture')}>Profile Picture</span>
            <ArrowForwardIcon className="right-arrow" onClick={() => handleArrowClick('Profile Picture')} />
          </div> */}
        </div>

        <p className="title">Preferences</p>
        <div className="settings-list">
          <div className="settings-item">
            <span>Dark Mode</span>
            <div
              id="toggleButton"
              className={`toggle-button ${isDarkMode ? 'active' : ''}`} //if true/false, shorthand goes crazy
              onClick={toggleDarkMode}
            ></div>
          </div>
          {/* <div className="settings-item">
            <span onClick={() => handleArrowClick('Accessibility')}>Accessibility</span>
            <ArrowForwardIcon className="right-arrow" onClick={() => handleArrowClick('Accessibility')} />
          </div> */}
        </div>

        <p className="title">About</p>
        <div className="settings-list">
          <div className="settings-item">
            <span onClick={() => handleArrowClick('Privacy Policy')}>Privacy Policy</span>
            <ArrowForwardIcon className="right-arrow" onClick={() => handleArrowClick('Privacy Policy')} />
          </div>
          {/* <div className="settings-item">
            <span onClick={() => handleArrowClick('Terms of Service')}>Terms of Service</span>
            <ArrowForwardIcon className="right-arrow" onClick={() => handleArrowClick('Terms of Service')} />
          </div> */}
          {/* <div className="settings-item">
            <span>Contact Us</span>
            <ArrowForwardIcon className="right-arrow"></ArrowForwardIcon>
          </div> */}

        </div >
      </div >

      <button
        className="logout-button"
        onClick={async () => {
          await signOut(auth);
          googleLogout();
        }}
      >
        Sign Out
      </button>

      <UsernameModal
        isOpen={showUsernameModal}
        onClose={closeUsernameModal}
        onSubmit={handleUsernameSubmit}
      />

      <PrivacyPolicyModal 
        isOpen={showPrivacyPolicyModal}
        onClose={closePrivacyPolicyModal}
      />
    </div >
  );
};

export default SettingsView;
