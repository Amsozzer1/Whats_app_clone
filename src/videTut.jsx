import {
  CallControls,
  CallingState,
  SpeakerLayout,
  StreamCall as StreamCallComponent,
  StreamTheme,
  StreamVideo,
  StreamVideoClient,
  useCallStateHooks
} from '@stream-io/video-react-sdk';
import '@stream-io/video-react-sdk/dist/css/styles.css';
import './videoCall.css';
import { useEffect, useState } from 'react';
import { useWebSocket } from './WebSocket';

// Make sure to use REACT_APP_ prefix for environment variables in React
const apiKey = process.env.REACT_APP_STREAM_API_KEY;
const callId = 'QscXoXP3GOZS';

export default function StreamCall({ onLeave, userId, userName, userPhoto }) {
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const context = useWebSocket();
  
  // Debug log for context
  useEffect(() => {
    console.log("WebSocket context:", context);
    console.log("Stream API Key:", apiKey);
  }, [context]);

  // Get token from context
  const token = context?.userToken;
  
  // Check for media device support
  if (!navigator || !navigator.mediaDevices) {
    return (
      <div
        style={{
          width: '100%',
          height: '100vh',
          backgroundColor: 'red',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white'
        }}
      >
        <p>Your browser doesn't support required media features</p>
      </div>
    );
  }
  
  // Initialize client and call when component mounts
  useEffect(() => {
    // Reset state when dependencies change
    setClient(null);
    setCall(null);
    setLoading(true);
    setError(null);
    
    // Check if required props are provided
    if (!token || !userId) {
      console.log("Missing token or userId:", { token: !!token, userId: !!userId });
      setError("Missing required props: token and userId must be provided");
      setLoading(false);
      return;
    }
    
    console.log("Initializing with userId:", userId, "and token:", token.substring(0, 10) + "...");
    
    try {
      // Create user object
      const user = {
        id: userId,
        name: userName || userId,
        image: userPhoto,
      };
      
      console.log("Creating user:", user);
      
      // Initialize the client
      const newClient = new StreamVideoClient({
        apiKey,
        tokenProvider: async () => token,
        user
      });
      
      console.log("Client created successfully");
      
      // Create and join the call
      const newCall = newClient.call('default', callId);
      console.log("Call instance created, attempting to join...");
      
      newCall.join({ create: true })
        .then(() => {
          console.log("Successfully joined call");
          setClient(newClient);
          setCall(newCall);
          setLoading(false);
        })
        .catch(err => {
          console.error("Failed to join call:", err);
          setError(`Failed to join call: ${err.message}`);
          setLoading(false);
          
          // Try to disconnect the client on error
          try {
            newClient.disconnectUser();
          } catch (cleanupErr) {
            console.error("Error during cleanup:", cleanupErr);
          }
        });
      
      // Clean up when component unmounts
      return () => {
        console.log("Cleaning up video call resources");
        try {
          if (newCall.state?.callingState !== 'left') {
            newCall.leave();
          }
          newClient.disconnectUser();
        } catch (error) {
          console.error("Error during call cleanup:", error);
        }
      };
    } catch (err) {
      console.error("Error initializing video call:", err);
      setError(`Error initializing video call: ${err.message}`);
      setLoading(false);
    }
  }, [token, userId, userName, userPhoto]);
  
  // Render loading state
  if (loading) {
    return (
      <div className="call-loading">
        <p>Initializing call...</p>
        <p><small>This may take a moment</small></p>
      </div>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <div className="call-error">
        <h3>Error</h3>
        <p>{error}</p>
        <button onClick={onLeave}>Go Back</button>
      </div>
    );
  }
  
  // Render when client or call initialization failed
  if (!client || !call) {
    return (
      <div className="call-error">
        <h3>Initialization Error</h3>
        <p>Failed to initialize video components</p>
        <button onClick={onLeave}>Go Back</button>
      </div>
    );
  }
  
  // Render the video call UI
  return (
    <StreamVideo client={client}>
      <StreamCallComponent call={call}>
        <MyUILayout onLeave={onLeave} />
      </StreamCallComponent>
    </StreamVideo>
  );
}

export const MyUILayout = ({ onLeave }) => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  
  if (callingState !== CallingState.JOINED) {
    return (
      <div className="connecting-state">
        <p>Connecting to call...</p>
        <p>Status: {callingState}</p>
      </div>
    );
  }
  
  return (
    <StreamTheme>
      <SpeakerLayout participantsBarPosition='bottom' />
      <CallControls onLeave={onLeave} />
    </StreamTheme>
  );
};