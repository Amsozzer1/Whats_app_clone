import React, { Component,useState,useEffect } from 'react';
import './App.css';
import './ChatScroll'
import './SideBar'
import ChatScroll from './ChatScroll';
import SideBar from './SideBar';
import { getRedirectResult,getAuth, createUserWithEmailAndPassword,RecaptchaVerifier,GoogleAuthProvider,signInWithPhoneNumber,signInWithRedirect, onAuthStateChanged,signInWithPopup,signOut} from "firebase/auth";
import './FirebaseSecrets';
import ChatPage from './ChatPage';
import { Dummy_chat,Dummy_chat2,Dummy_chat3 } from './DummyData';
import * as Database from './FirebaseAPI'
import BASE_BACK_URL from './URL';
import StreamCall from './videTut';
import IncomingCallNotification from './CallNotification';
import { WebSocketProvider } from './WebSocket';
import CallHandler from './CallHandler';
import IncomingCall from './CallNotification';
import OutgoingCall from './outgoingCall';
import useWindowDimensions from './WindowDims';
const auth = getAuth();
const provider = new GoogleAuthProvider();

export default function App(){
   
  
      const [currChat,setCurrChat] = useState([]);
      const [currChatUser,setCurrChatUser] = useState("");
      const [currChatUserID,setCurrChatUserID] = useState("");
      const [onCall,setOnCall] = useState(false);
      const [showOutGoing,setShowOutGoing] = useState(false);
      const [callID,setCallID] = useState("");
      const [user,setUser] = useState(null);
      const [allChats,setAllChats] = useState([]);
      const [isAddUserOpen, setIsAddUserOpen] = useState(false);



      const [accepted,setAccepted] = useState(false);

    function handleLogout(){
      signOut(auth);
    }

    async function handleChatClear() {
      try {
        const response = await fetch(`${BASE_BACK_URL}/clearChats?collection=${user?.uid}`, {
          method: 'DELETE'
        });
        const result = await response.json();
        if (result.success){
          window.location.reload();
        }
        return result.success;
      } catch (error) {
        console.error('Error clearing chat:', error);
        return false;
      }
    }
    
    async function deleteUser() {
      try {
        const response = await fetch(`${BASE_BACK_URL}/deleteUser?userId=${user?.uid}`, {
          method: 'DELETE'
        });
        const result = await response.json();
        return result.success;
      } catch (error) {
        console.error('Error deleting user:', error);
        return false;
      }
    }

      function handleCallAccept(callid){
        setAccepted(true);
        // setCallID(callid);
      }
      function updateChats(chatUser,currChat,ChatUserID){
        setCurrChatUser(chatUser);
        setCurrChat(currChat);
        setCurrChatUserID(ChatUserID);
        // console.log(chatUser);
      }

      function updateAllChat(chatUpdatedFor, message) {
        return allChats.map(chat => {
          if (chat.id === chatUpdatedFor) {
            // Create a copy of the chat object
            const updatedChat = { ...chat };
            // Add the message to data.chat
            updatedChat.data.chat.push(message);
            return updatedChat;
          }
          return chat;
        });
      }

      // useEffect(() => {
      //   console.log('onCall value changed:', user?.displayName);
      // }, [user]);

      useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user1) => {
          if (user1) {
            setUser(user1);

            
            fetch(BASE_BACK_URL+"/getChats?CollectionName="+user1.uid,
              {
                method:'GET',
                headers:{
                  'Content-Type': 'application/json'
                }
              }
            )
            .then((res)=>res.json())
            .then(data=>{
              setAllChats(data.documents)
              // console.log(data.documents[0].data.chat);
            })  
            .catch(error=> console.error(error))

          } else {
            setUser(null);
          }
        });
        
        return () => unsubscribe();
      }, [auth]);

    function SignUp(){
      signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
      }).catch((error) => {
        alert(error);
        const errorCode = error.code;
        if(errorCode=='auth/popup-blocked'){
        
        }
        const errorMessage = error.message;
        const credential = GoogleAuthProvider.credentialFromError(error);
        alert(errorCode);
      });

    }
    const { height, width } = useWindowDimensions();
    
    const [back,setBack] = useState(true);
    function handleBack(state){
      setBack(state);
    }
    
    return (
      
    user!=null&& user? 
    <WebSocketProvider userId={user?.uid} user={user}>
      <div className="App" style={{backgroundColor: '#111b21',minHeight:'100svh'
      ,display:'flex',flexDirection:'row',gap:'2px',
      
    }}>
      {/* <div id="recaptcha-container"></div> */}
      <SideBar User={user} handleLogout={handleLogout} handleChatClear={handleChatClear} deleteUser={deleteUser}/>
      {/* <div style={{width:400,height:100}}><p style={{color:'white'}}>accepted:{accepted?'yes':'no'}</p></div> */}

      {/* <div
      style={{height:'100%',width:'30%',maxWidth:'400px'}}
      className='chat-scroll'
      > */}
        {/* <ChatScroll chats={allChats} handleOnClick={updateChats} user={user}/> */}
      {/* </div> */}
      {/* <button onClick={()=>{Database.sendData()}}>out</button> */}
      {/* {onCall?<StreamCall onLeave={()=>setOnCall(false)}/>:<ChatPage chat={currChat} currChatUser={currChatUser} currChatUserID={currChatUserID} user={user} onCall={()=>setOnCall(true)}/>} */}
      {
      width>1000 ?
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        width:'100%',
        // backgroundColor:'red'
      }}>
        <div style={{ 
          width: '30%', 
          maxWidth: '400px',
          minWidth: '280px'  // Adding a minimum width for usability
        }}>
          <ChatScroll 
          setIsAddUserOpen={setIsAddUserOpen}
          isAddUserOpen={isAddUserOpen}
            handleBack={handleBack} 
            chats={allChats} 
            handleOnClick={updateChats} 
            user={user}
            handleLogout={handleLogout} 
            handleChatClear={handleChatClear} 
            deleteUser={deleteUser}
            allChats={allChats}
            updateAllChat={setAllChats}
          />
        </div>
        <div style={{ 
          flex: 1  // This will make it take up the remaining space
        }}>
          <ChatPage 
          updateAllChat={updateAllChat}
          setIsAddUserOpen={setIsAddUserOpen}
          isAddUserOpen={isAddUserOpen}
            handleOnClick={updateChats} 
            handleBack={handleBack} 
            chat={currChat} 
            currChatUser={currChatUser} 
            currChatUserID={currChatUserID} 
            user={user} 
            onCall={()=>setOnCall(true)} 
            showOutGoing={()=>{setShowOutGoing(true)}}
            allChats={allChats}
            setAllChats={setAllChats}

            
            // handleLogout,handleChatClear,deleteUser
          />
        </div>
      </div>:
        !back?
          <ChatPage
          updateAllChat={updateAllChat}
          allChats={allChats}
          setAllChats={setAllChats}
          setIsAddUserOpen={setIsAddUserOpen}
          isAddUserOpen={isAddUserOpen}
          handleOnClick={updateChats} 
          handleBack={handleBack} 
          chat={currChat} 
          currChatUser={currChatUser} 
          currChatUserID={currChatUserID} 
          user={user} 
          onCall={()=>setOnCall(true)} 
          showOutGoing={()=>{setShowOutGoing(true)}}
          // handleLogout={handleLogout} handleChatClear={handleChatClear} deleteUser={deleteUser}
          />
            :
          <ChatScroll
          allChats={allChats}
            setAllChats={setAllChats}
          handleLogout={handleLogout} 
            handleChatClear={handleChatClear} 
            deleteUser={deleteUser}
          setIsAddUserOpen={setIsAddUserOpen} isAddUserOpen={isAddUserOpen}
          handleBack={handleBack} chats={allChats} handleOnClick={updateChats} user={user}/>
      }
      
      {showOutGoing?<OutgoingCall handleAccept={handleCallAccept} showOutGoing={setShowOutGoing} receiverName={currChatUser} currChatUserID={currChatUserID}/>:null}
      {accepted? <StreamCall 
        onLeave={()=>{setAccepted(false)}}
        // token={"abcbkjcasbefkblknlklkcb"}
        userId={user?.uid}
        userName={user?.displayName}
        userPhoto={user?.photoURL}
      
      />:null}
      <IncomingCall userID={user?.uid} setCallID_={setCallID} handleAccept={handleCallAccept}/>
      {/* <CallHandler /> */}
      {/* <IncomingCallNotification/> */}
    </div>
    </WebSocketProvider>
    :<div className="login-container">
    <div className="login-card">
      <div className="login-header">
        <h2>Welcome Back</h2>
        <p>Sign in to continue to Chat</p>
      </div>
      
      <button 
        id="sign-in-button"
        className="google-signin-btn"
        onClick={() => {
          if(!SignUp()) {
            // alert('eeror')
          }
        }}
      >
        <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
          <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
            <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
            <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
            <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
            <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
          </g>
        </svg>
        <span>Sign in with Google</span>
      </button>
    </div>
  </div>

    );
  }

