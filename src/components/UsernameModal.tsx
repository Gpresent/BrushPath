import React, { useState, useContext, useRef } from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import "../styles/settings.css";
import { updateUserName } from "../utils/FirebaseQueries";
import { AuthContext } from "../utils/FirebaseContext";
import Modal from "./Modal";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (username: string) => void;
}

const UsernameModal: React.FC<ModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [username, setUsername] = useState("");
  const { user } = useContext(AuthContext);
  const modalRef = useRef(null);

  const handleSubmit = () => {
    console.log(user);
    updateUserName(username)
      .then((success) => {
        if (success) {
          console.log("The user's name was updated successfully.");
        } else {
          console.log("Failed to update the user's name.");
        }
      })
      .catch((error) => {
        console.error("An unexpected error occurred:", error);
      });

    onSubmit(username);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal title={"Edit Your Username"} onClose={onClose} onSubmit={onSubmit} isOpen={isOpen}>
      <form onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="username" className="input-label">
          Username
        </label>
        <div className="input-icon-container">
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <ArrowForwardIcon
            className="right-arrow-modal"
            onClick={handleSubmit}
          />
        </div>
      </form>
    </Modal>
  );
};

export default UsernameModal;
