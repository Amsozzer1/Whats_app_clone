import React, { useEffect } from 'react';
import { useWebSocket } from './WebSocket';
import './outgoingCall.css';

function OutgoingCall({ receiverName, showOutGoing, currChatUserID,handleAccept}) {
  const { callStatus, cancelCall,respondToCall,callID } = useWebSocket();

  const handleCancelCall = () => {
    showOutGoing(false);
    cancelCall(currChatUserID);
  };
  useEffect(()=>{
    if(callStatus=='accepted' && callID!=""){
      showOutGoing(false);
      handleAccept(true);
    }
    // console.log('hereID',callID,callStatus);
  },[callID,callStatus])

  // useEffect(()=>{
  //   console.log(callStatus,callID);
  // },[callStatus])

  return (
    <div className="outgoing-call-overlay">
      <div className="outgoing-call-card">
        {callStatus === 'declined' ? (
          <>
            <h3>Call Declined</h3>
            <p>{receiverName || 'User'} declined your call</p>
            <div className="declined-icon">❌</div>
          </>
        ) : (
          <>
            <h3>Calling</h3>
            {/* {callID!=''?<p>{callID}</p>:<p>nothing here</p>} */}
            <p>{receiverName || 'User'}</p>
            <div className="calling-animation">
              <i>📞</i>
            </div>
          </>
        )}
        <div className="call-actions">
          <button
            className="cancel-button"
            onClick={handleCancelCall}
          >
            {callStatus === 'declined' ? 'Close' : 'Cancel'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default OutgoingCall;