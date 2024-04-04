import React, { Children } from "react";
import "../styles/settings.css";
import CloseIcon from '@mui/icons-material/Close';


interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (username: string) => void;
  title: string;
  children: React.ReactNode, 
}

const Modal: React.FC<ModalProps> = ({ children, title, isOpen, onClose, onSubmit }) => {

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div
        className="modal-background"
        onClick={(e) => {
          onClose();
        }}
      ></div>
      
      <div className="modal-content">
        <div className="modal-close" onClick={(e)=>onClose()}><CloseIcon style={{fontSize:"15px"}}/></div>
        <div className="modal-title">{title}</div>
        {children}
      </div>

    </div>
  );
};

export default Modal;
