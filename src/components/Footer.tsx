import React from "react";
import "../styles.css";
import { RiHomeLine, RiFolderLine, RiBook2Line } from "react-icons/ri";
import { CiFolderOn } from "react-icons/ci";


import BookOutlinedIcon from '@mui/icons-material/BookOutlined';

export default function Footer() {
  return (
    <>
      <div className="footer-wrapper">
        <div className="footer">
          <div className="icon">
            <RiHomeLine className="icon-styling"/>
            <p className="footer-text">Home</p>
          </div>
          <div className="icon">
            <RiFolderLine className="icon-styling"/>
            <p className="footer-text">Decks</p>
          </div>
          <div className="icon">
            <RiBook2Line className="icon-styling"/>
            <p className="footer-text">Dictionary</p>
          </div>
        </div>
      </div>
    </>
  );
}
