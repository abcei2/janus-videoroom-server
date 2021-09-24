import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import JanusVideoRoom from './components/JanusVideoRoomComponent';
// import SimpleVideoRoom from './components/SimpleVideoRoomComponent';
import reportWebVitals from './reportWebVitals';



// var janus_webrtc_server='ws://207.246.118.54:8188'
var janus_webrtc_server='ws://127.0.0.1:8188'
ReactDOM.render(
  <React.StrictMode>
    <JanusVideoRoom video_id="video1" audio_id="audio1" token="123456789" room="1234" server={janus_webrtc_server}/>   
    {/* <JanusVideoRoom video_id="video2" audio_id="audio2" token="123456789" room="1234" server={janus_webrtc_server}/> 
    <JanusVideoRoom video_id="video3" audio_id="audio3" token="123456789" room="1234" server={janus_webrtc_server}/> 
    <JanusVideoRoom video_id="video4" audio_id="audio4" token="123456789" room="1234" server={janus_webrtc_server}/>   */}
  
  </React.StrictMode>,
  document.getElementById('root')
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
