import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import JanusVideoRoom from './JanusVideoRoomComponent';
import reportWebVitals from './reportWebVitals';




ReactDOM.render(
  <React.StrictMode>
    <JanusVideoRoom video_id="video1" audio_id="audio1"/>
    <JanusVideoRoom video_id="video2" audio_id="audio2"/>
    <JanusVideoRoom video_id="video3" audio_id="audio3"/>
    <JanusVideoRoom video_id="video4" audio_id="audio4"/>    
  
  </React.StrictMode>,
  document.getElementById('root')
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
