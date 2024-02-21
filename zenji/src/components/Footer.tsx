import React from "react";
import "../styles.css";

export default function Footer() {
  return (
    <>
      <div className="footer-wrapper">
        <div className="footer">
          <div className="icon">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/7c322aa7nml-I497%3A24136%3B464%3A23863?alt=media&token=3c7d75a1-f179-423e-a041-1140ec3c36c0"
              alt="Not Found"
              className="fiber-_manual-_record"
            />
            <p className="footer-text">Home</p>
          </div>
          <div className="icon">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/7c322aa7nml-I497%3A24136%3B464%3A23872?alt=media&token=c9e61d0e-769f-4f7f-8fd5-0b34f70b3e4a"
              alt="Not Found"
              className="fiber-_manual-_record"
            />
            <p className="footer-text">Decks</p>
          </div>
          <div className="icon">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/7c322aa7nml-I497%3A24136%3B464%3A23878?alt=media&token=4e19fc8a-136d-46be-b84d-c6234376d707"
              alt="Not Found"
              className="fiber-_manual-_record"
            />
            <p className="footer-text">Dictionary</p>
          </div>
        </div>
      </div>
    </>
  );
}
