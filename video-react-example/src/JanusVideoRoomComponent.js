
import React from 'react';
class JanusVideoRoom extends React.Component {

    componentDidMount() {
        var video_id= this.props.video_id
        var audio_id= this.props.audio_id
        var room = this.props.room;
        var janus_props_session={
            url: this.props.server,
        }
        var JanusClient = require('janus-videoroom-client').Janus;
        
        if( this.props.token)
            janus_props_session.token=this.props.token

        var client = new JanusClient(janus_props_session);
        var pc = null;
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
            console.log(evt.track.kind,evt.streams[0],audio_id,video_id)
            if (evt.track.kind === 'video') {
                document.getElementById(video_id).srcObject = evt.streams[0];
                
            } else if(evt.track.kind === 'audio') {
                document.getElementById(audio_id).srcObject = evt.streams[0];
            }
        });
        console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")

        client.connect();   
    // set el height and width etc.
    }
    render() {
        return (
            <div id="media" height="400px" width="400px">
                <h2>Media</h2>
                <video id={this.props.video_id} autoPlay={true}></video>        
                <audio id={this.props.audio_id}  autoPlay={true}></audio>
            </div>
        )
    }
}


export default JanusVideoRoom;
