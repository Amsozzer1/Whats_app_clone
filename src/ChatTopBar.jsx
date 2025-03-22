import React,{useState,useEffect} from 'react';
import './ChatTopBar.css';
import CallIcon from '@mui/icons-material/Call';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import NoImage from './Untitled.jpeg';
import { useWebSocket } from './WebSocket';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BASE_BACK_URL from './URL';

function ChatTopBar({handleBack,user,onCall,initiateCall, connected,calledTo,showOutGoing}){
    const [userTop,setUser] = useState();
    const [photo,setPhoto] = useState();
    async function getUserByID(uid) {
        try {
            const response = await fetch(`${BASE_BACK_URL}/getUser?userId=${uid}`);
            if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data;  // This is important - make sure the function returns the data
        } catch (error) {
            console.log("Error fetching user:", error);
            return null;
        }
        }
        useEffect(() => {
            async function loadUser() {
              const userData = await getUserByID(calledTo);
              // console.log(userData);
              setUser(userData);
            }
            
            loadUser();
          }, [calledTo]);
    
    return(
        // user ? (
            <div className='header-bar'>
              <div className='row'>
                <button  className='back-btn' onClick={()=>{handleBack(true)}}><ArrowBackIcon /></button>
                <img src={userTop?.photoURL} alt='no-image' className='avatar'></img>
                <h2>{userTop?.displayName}</h2>
              </div>
              <div className='row'>
                <button className='btn-chatBar'><CallIcon className='call-icon-style'/></button>
                <button
                  onClick={() => {showOutGoing();initiateCall(calledTo,user)}}
                  disabled={!connected}
                  className='btn-chatBar'
                >
                  <VideoCallIcon className='call-icon-style'/>
                </button>
              </div>
            </div>
      
    );
}

export default  ChatTopBar;