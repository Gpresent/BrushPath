import React from 'react';



interface LoadingBarProps {
    progress: number,
    duration: number,
    message: string
}

const LoadingBar: React.FC<LoadingBarProps> = ({ progress, duration, message }) => {
    return (
        <>
        <p>{message}
        </p>
        <div className="loading-bar-container">
          <div
            className="loading-bar"
            style={{ width: `${(progress/duration)*100}%` }}
          ></div>
        </div>
        </>
      );

}

export default LoadingBar;