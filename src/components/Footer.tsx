import React from "react";
import '../styles/styles.css'

import { RiHomeLine, RiFolderLine, RiBook2Line } from "react-icons/ri";
// import { CiFolderOn } from "react-icons/ci";
import { Link } from "react-router-dom";

// import BookOutlinedIcon from '@mui/icons-material/BookOutlined';
// import ComponentRouter from "../router/router";

export default function Footer() {
  return (
    <>
      
      <div className="footer-wrapper">
        <div className="footer">
          <div className="icon">
            <Link to="/home/Test">
              <RiHomeLine className="icon-styling"/>
              <p className="footer-text">Home</p>
            </Link>
          </div>
          <div className="icon">
            <Link to="/decks">
              <RiFolderLine className="icon-styling"/>
              <p className="footer-text">Decks</p>
            </Link>
          </div>
          <div className="icon">
            <Link to='/dictionary'>
              <RiBook2Line className="icon-styling"/>
              <p className="footer-text">Dictionary</p>
            </Link>
          </div>
        </div>

      </div>
    </>
  );
}
