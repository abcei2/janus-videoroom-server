
import React from 'react';

function pc_create_negotiate(publisher){

    let offer_json={sdp:publisher.listenerHandle.getOffer(),type:"offer"}

    var config = {
        sdpSemantics: 'unified-plan',
        // config.iceServers = [{urls: ['stun:stun.l.google.com:19302']}];
    };
    let pc = new RTCPeerConnection(config);
    pc.addEventListener('track', function(evt) {
        console.log(evt.track.kind,evt.streams[0])
        if (evt.track.kind === 'video') {
            document.getElementById(publisher.video_id).srcObject = evt.streams[0];
            
        } else if(evt.track.kind === 'audio') {
            document.getElementById(publisher.audio_id).srcObject = evt.streams[0];
        }
    });   
    pc.setRemoteDescription(offer_json);
    //After adding offer of remote descriptor add video transceirver or audio and then create an answer
    pc.addTransceiver('video', {direction: 'recvonly'});
    pc.addTransceiver('audio', {direction: 'recvonly'});
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
        publisher.listenerHandle.setRemoteAnswer(answer.sdp).then(()=>{
        console.log("ANSWERD SEND VIDEO IS STARTING...")              

        });
    })
    return pc;
    
}

class JanusVideoRoom extends React.Component {

    constructor(props) {
        super(props);
        this.state = {publishers: [],selected:0,publish_counter:0, pc:null, connected: false};
    }
    componentDidMount() {
        var video_id= this.props.video_id
        var audio_id= this.props.audio_id
        var room = this.props.room
        var janus_props_session={
            url: this.props.server,
        }
        var JanusClient = require('janus-videoroom-client').Janus;
        
        if( this.props.token)
            janus_props_session.token=this.props.token

        var client = new JanusClient(janus_props_session);
        var publishers=[]   

        client.onConnected(()=>{
        client.createSession().then((session)=>{
            console.log("CREATING SESSION")
            session.videoRoom().getFeeds(room).then((feeds)=>{
                console.log(room,feeds)
                for(let x in feeds){
                    //TAKES JUST THE FIRST FEED THEN BREAKS
                    session.videoRoom().listenFeed(room, feeds[x]).then((listenerHandle)=>{
                        //Starting negotiation
                        this.setState({publish_counter:this.state.publish_counter+1})
                        publishers.push(
                            {
                                listenerHandle:listenerHandle,
                                video_id:video_id,
                                audio_id:audio_id,
                                feed:listenerHandle.feed,
                                publish_number:this.state.publish_counter
                            }
                        )
                        
                        this.setState( {publishers:publishers })
                        
                        this.setState({ selected: this.state.publish_counter });
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

        client.connect();   
    // set el height and width etc.
    }
    change = (event) => {
        if(this.state.pc && this.state.connected)
            this.state.pc.close()
        this.setState({pc:null, connected:false})
        this.setState({ selected: event.target.value });

    }
    connect =  (event) => {
        if(!this.state.connected){
            try {
                this.setState({pc:pc_create_negotiate(this.state.publishers[this.state.selected-1]), connected:true})      
            } catch (error) {
                console.log("No publishers yet");               
            }
        }
    }
    disconnect =  (event) => {
        if(this.state.pc && this.state.connected)
            this.state.pc.close()
        this.setState({pc:null, connected:false})
    }
    render() {
        const divStyle={
            borderStyle: "solid",
            width: "35%"
        }
        return (
            <div id="media" style={divStyle}>
                <h2 >SALA {this.props.room}</h2>
                
                <div>
                    <h3> Elija streaming </h3>
                    <select onChange={this.change} value={this.state.selected}>
                        {this.state.publishers.map((publisher) => (
                            <option key={publisher.feed} value={publisher.publish_number}>{publisher.feed}</option>
                        ))}
                    </select>
                </div>
                <div>

                    <button onClick={this.connect}>Connect!</button>
                    <button onClick={this.disconnect}>Disconnect!</button>
                </div>
                <br/>
                <div>
                    <video id={this.props.video_id} autoPlay={true} controls></video>        
                    <audio id={this.props.audio_id}  autoPlay={true}></audio>
                </div>
            </div>
        )
    }
}


export default JanusVideoRoom;
