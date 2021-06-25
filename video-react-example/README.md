


## ref 
https://www.npmjs.com/package/janus-videoroom-client 
## Installing and starting development
npm install
npm start

## then go to  
http://localhost:3000/

# Usefull information  
## on src/index.js find  
Create client without authentication  
var client = new JanusClient({  
  url: 'ws://janus_server_ip:janus_websocket_port' // set your own janus host and port
});

## Register events connected, disconnected, error
When **client.connect()** onConnected event occurs and client can create a session to janus server.
client.onConnected(()=>{
    client.createSession().then((session)=>{
        ...
    }).catch((err)=>{
        ...
    })
});

## Call connect method
client.connect();
## Create a new janus session
client.createSession().then((session)=>{
    ...
});
## Get feeds of some room (default-1234-janus-room)  
session.videoRoom().getFeeds(room).then((feeds)=>{
    for(let feed of feeds) {
        ...
    }
});

Each feed has an offer, in the **video-react-example** with take just the first feed if exists.  

## Then with room and feed we can subscribe to get the stream of that feed:

session.videoRoom().listenFeed(room, feed).then((listenerHandle)=>{
    var offerSdp = listenerHandle.getOffer();
    ...
});

## So in the example app we start the negotiation like this if atleast one feed exists.
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
    // End of negotiation
});
