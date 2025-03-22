// src/components/CallHandler.js
import React, { useState, useEffect } from 'react';
import { useWebSocket } from './WebSocket';
// import StreamCallss from './StreamCallss'; // Your video call component

function CallHandler() {
  const [onCall, setOnCall] = useState(false);
  const { incomingCall, clearIncomingCall } = useWebSocket();
  
  // Start a call when accepted
  useEffect(() => {
    if (incomingCall && incomingCall.status === 'accepted') {
      setOnCall(true);
      clearIncomingCall();
    }
  }, [incomingCall]);
  
  // Handle call end
  const handleCallEnd = () => {
    setOnCall(false);
  };
  
  if (!onCall) return null;
  
  return (
    // <StreamCallss onLeave={handleCallEnd} />
    <div
    style={{
        width:1000,height:1000,backgroundColor:'wheat'
    }}
    
    ></div>
  );
}

export default CallHandler;