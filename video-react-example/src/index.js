import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';


var JanusClient = require('janus-videoroom-client').Janus;

var client = new JanusClient({
  url: 'ws://207.246.118.54:8188'
});

var pc = null;
var room = "1234";
var config = {
  sdpSemantics: 'unified-plan',
  // config.iceServers = [{urls: ['stun:stun.l.google.com:19302']}];
};

pc = new RTCPeerConnection(config);


client.onConnected(()=>{
  client.createSession().then((session)=>{
    console.log("CREATING SESSION")
    session.videoRoom().getFeeds(room).then((feeds)=>{
      if(feeds.length===0)
        console.log("NO FEEDS ON THIS ROOM")
      else{
        //TAKES JUST THE FIRST FEED THEN BREAKS
        var feed=feeds[0]
        session.videoRoom().listenFeed(room, feed).then((listenerHandle)=>{
          //Starting negotiation
          var offerSdp = listenerHandle.getOffer();
          
          let offer_json={sdp:offerSdp,type:"offer"};

          pc.setRemoteDescription(offer_json);
          //After adding offer of remote descriptor add video transceirver or audio and then create an answer
          pc.addTransceiver('video', {direction: 'recvonly'});
          //pc.addTransceiver('audio', {direction: 'recvonly'});
          pc.createAnswer().then(function(answer) {
            console.log("CREATING ANSWER")              
            return pc.setLocalDescription(answer);
          }).then(function() {
            // wait for ICE gathering to complete
            return new Promise(function(resolve) {
                if (pc.iceGatheringState === 'complete') {
                    resolve();
                } else {
                    function checkState() {
                        if (pc.iceGatheringState === 'complete') {
                            pc.removeEventListener('icegatheringstatechange', checkState);
                            resolve();
                        }
                    }
                    pc.addEventListener('icegatheringstatechange', checkState);
                }
            });
          }).then(function() {
            var answer = pc.localDescription;
            // Send the answer to the remote peer through the signaling server.
            listenerHandle.setRemoteAnswer(answer.sdp).then(()=>{
              console.log("ANSWERD SEND VIDEO IS STARTING...")              
          
            });
          })
        
        });
      }
    });
    
  })
  .catch((err)=>{
    console.log("SOME ERROR",err)
  })
});

client.onDisconnected(()=>{
  console.log("DISCONNECTED")
    
});
client.onError((err)=>{
  console.log("DISCONNECTED")
});

pc.addEventListener('track', function(evt) {
  console.log(evt.track.kind,evt.streams[0])
  if (evt.track.kind === 'video') {
    document.getElementById('video').srcObject = evt.streams[0];
    
  } else {
    document.getElementById('audio').srcObject = evt.streams[0];
  }
});


client.connect();   


ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
