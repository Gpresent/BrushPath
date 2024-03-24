import React, { useState } from 'react';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import "../styles/settings.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (username: string) => void;
}

const UsernameModal: React.FC<ModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [username, setUsername] = useState('');
  
    const handleSubmit = () => {
      onSubmit(username);
      onClose();
    };
  
    if (!isOpen) return null;
  
    return (
      <div className="modal">
        <div className="modal-content">
          <h2 className="modal-title">Edit Your Username</h2>
          <form onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="username" className="input-label">Username</label>
            <div className="input-icon-container">
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <ArrowForwardIcon className="right-arrow-modal" onClick={handleSubmit} />
            </div>
          </form>
        </div>
      </div>
    );
  };

export default UsernameModal;