import React, { useEffect, useState } from 'react';
import { useWebSocket } from './WebSocket';
import './IncomingCall.css'

function IncomingCall({showOutGoing,setCallID_,handleAccept,userID}) {
  const context = useWebSocket();
  const { incomingCall, respondToCall,callStatus } = context;
  const [ringing, setRinging] = useState(null);
  function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  const [newCallID,setCallID] = useState('');
  useEffect(()=>{
    setCallID(generateUUID());
  },[])
  useEffect(()=>{
    setCallID_(newCallID);
  },[newCallID])
  // When context changes, update our local state
  useEffect(() => {
    // console.log('WebSocket context incomingCall:', context.incomingCall);
    // console.log('WebSocket context callStatus:', context.callStatus);
    setRinging(context.callStatus);
    // console.log('Ringing',ringing);
  }, [context]);
  
  // Don't render if there's no incoming call
  if (!incomingCall) {
    // console.log("No incoming call to render");
    return null;
  }
  if(callStatus==="declined"){
    // console.log("HEREEE")
    return null;
  }
  if(callStatus==="accepted" && newCallID!=""){
    // console.log('id: ',newCallID);
    return null;
  }

  
  // console.log("Rendering incoming call UI for:", incomingCall);
  
  return (
    <div className="incoming-call-overlay">
      <div className="incoming-call-card">
        <h3>Incoming Call</h3>
        <p>From: {incomingCall.callerName}</p>
        <div className="call-actions">
          <button
            className="decline-button"
            onClick={() => {
              // console.log("Declining call from:", incomingCall.callerId);
              respondToCall(incomingCall.callerId, false,newCallID,userID);
              
              if (typeof showOutGoing === 'function') {
                showOutGoing();
              }
            }}
          >
            Decline
          </button>
          <button
            className="accept-button"
            onClick={() => {
              // console.log("Accepting call from:", incomingCall.callerId);
              console.log(newCallID);
              handleAccept(true);
              // showOutGoing(false);

              respondToCall(incomingCall.callerId, true,newCallID,userID);
            }}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}

export default IncomingCall;