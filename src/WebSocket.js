// src/contexts/WebSocketContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
// import * as crypto from 'crypto';
const WebSocketContext = createContext(null);

export function WebSocketProvider({ children, userId,user }) {
  
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [incomingCall, setIncomingCall] = useState(null);
  const [callStatus,setCallStatus] = useState(null);
  const [callID,setCallID] = useState('');
  const [userToken,setUserToken] = useState('');
  const [messages,setMessages] = useState({});
  // In your WebSocketProvider
useEffect(() => {
    if (socket && connected) {
      const interval = setInterval(() => {
        try {
          socket.send(JSON.stringify({ type: 'ping' }));
        } catch (e) {
          console.error('Error sending ping:', e);
          setConnected(false);
        }
      }, 30000); // Every 30 seconds
      
      return () => clearInterval(interval);
    }
  }, [socket, connected]);
  // Connect to WebSocket
  useEffect(() => {
    if (!userId) return;
    
    const ws = new WebSocket(`wss://whats-app-clone-backend-1wf4.onrender.com/socket`);
    // const ws = new WebSocket(`ws://192.168.0.53:3006/socket`);
    
    ws.onopen = () => {
      console.log('WebSocket connected');
      setConnected(true);
      
      // Register user with server
      ws.send(JSON.stringify({
        type: 'register',
        userId: userId
      }));
    };
    
    // call_canceled
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('WS message received:', event.data);
        
        // Handle incoming calls
        if (data.type === 'incoming_call') {
            setIncomingCall(data);
        }
        if (data.type === "registered"){
          if(data.success){
            setUserToken(data.token);
          }
        }
        if (data.type === 'call_canceled') {
            console.log('Received call_canceled message:', data);
            // If there's an incoming call from this caller, clear it
            if (incomingCall && incomingCall.callerId === data.callerId) {
            console.log('Clearing incoming call due to cancellation');
            
            }
            setCallStatus(null);
            setIncomingCall(null);
        }
        if (data.type === 'call_response') {
            // console.log("ME IS ME")

            console.log('Call response received:', data.status);
            if (data.status === 'declined') {
                setCallStatus('declined');
                setIncomingCall(null);
            //   console.log('Set callStatus to declined');
            } else if (data.status === 'accepted') {
                console.log("ACEPETE")
                setCallStatus('accepted');
                if(connected && socket){
                sendMessage({
                    'type':"Call_info",
                    'userId':user.uid,
                    'userName':user.displayName,
                    'userPhoto':user.photoURL

                })
            }
            }
          }


          if(data.type === "call_info"){
            setCallID(data.callID);
            setCallStatus("accepted");
            setIncomingCall(null);
          }

          if(data.type === "call_status"){

          }
          if(data.type=="message_sent"){
            // const [messages,setMessages] = useState({});

            if (data.sender in messages) {
              setMessages(prevMessages => ({
                ...prevMessages,
                [data.sender]: [...prevMessages[data.sender], data.message]
              }));
            } else {
              setMessages(prevMessages => ({
                ...prevMessages,
                [data.sender]: [data.message]
              }));
            }
          }
        
        
        // You can add more message handlers here
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
    
    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setConnected(false);
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    
    setSocket(ws);
    
    // Clean up on unmount
    return () => {
      ws.close();
    };
  }, [userId]);
  
  // Function to send a message through WebSocket
  const sendMessage = (data) => {
    if (socket && connected) {
      socket.send(JSON.stringify(data));
    } else {
      console.error('Cannot send message, WebSocket not connected');
    }
  };
  
  // Function to initiate a call
  const initiateCall = (receiverId, callerName) => {
    sendMessage({
      type: 'call_request',
      receiverId,
      callerId: userId,
      callerName
    });
    setCallStatus('calling'); // Add this line
  };
  
  // Function to respond to a call
  const respondToCall = (callerId, accept,callID,userID) => {
    sendMessage({
      type: 'call_response',
      callerId,
      response: accept ? 'accepted' : 'declined',
      callID: callID,
      userID:userID,
      // updated : 'here'
    });
    
    if (accept) {
      setCallStatus('accepted');
      setIncomingCall(null);


    } else {
    //   console.log("HEERRRRW")
      setCallStatus('declined');
      setIncomingCall(null);
    }
  };

  // Reset incoming call state
  const clearIncomingCall = () => {
    setIncomingCall(null);
  };
  
  const cancelCall = (currentCallReceiverId) => {
    console.log(currentCallReceiverId);
    try {
      sendMessage({
        // type: 'call_canceled', // Changed to a distinct type
        type: 'call_canceled',
        receiverId: currentCallReceiverId,  // Use receiverId instead of currentCallReceiverId
        callerId: userId // Add who is canceling
        });
    } catch(error) {
      console.log(error);
    }
  };
  // Context value
  const value = {
    connected,
    incomingCall,
    callStatus,
    callID,
    userToken,
    messages,
    sendMessage,
    initiateCall,
    respondToCall,
    clearIncomingCall,
    setMessages,
    cancelCall, // Add this
  };
  
  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
}

// Custom hook to use the WebSocket context
export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
}
export {WebSocketContext};