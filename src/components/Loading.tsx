import React from "react";
import "../styles/styles.css";
import LoadingSpinner from "./LoadingSpinner";



const Loading: React.FC = () => {
  return (
    <>
    <div className="loading-page">
    <LoadingSpinner />
    </div>
    </>
  );
};

export default Loading;