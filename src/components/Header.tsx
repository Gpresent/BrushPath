import React from "react";
import "../styles/styles.css";
import "../styles/index.css";

import { BsPerson } from "react-icons/bs";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  const handleEditProfile = () => {
    console.log("clicked profile");
  };

  return (
    <div className="header-wrapper">
      <div className="header">
        <div className="settingsButton"></div>
        <div className="title">Zenji</div>
        <Link to={"/settings"}>
          <BsPerson
            className="settingsButton"
            onClick={handleEditProfile}
          ></BsPerson>
        </Link>
      </div>
    </div>
  );
};

export default Header;
