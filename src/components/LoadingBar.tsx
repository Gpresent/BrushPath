import React from 'react';



interface LoadingBarProps {
    progress: number,
    duration: number,
    message: string
}

const LoadingBar: React.FC<LoadingBarProps> = ({ progress, duration, message }) => {
    return (
        <div className='loading-bar-container'>
        <p className='loading-bar-text'>{message}
        </p>
        <div className="loading-bar-outer">
          <div
            className="loading-bar"
            style={{ width: `${(progress/duration)*100}%` }}
          ></div>
        </div>
        </div>
      );

}

export default LoadingBar;