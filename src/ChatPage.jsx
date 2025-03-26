import React,{useState,useEffect,useRef, use} from 'react';
import Bg from './BG.jpg';
import './ChatPage.css';
import ChatTopBar from './ChatTopBar';
import BASE_BACK_URL from './URL';
import { useWebSocket } from './WebSocket';
import useWindowDimensions from './WindowDims';
import ChatScroll from './ChatScroll';
import AddUserPopup from './addUser';

// 00a884
const TextInputBar = ({ onSendMessage }) => {
    const [message, setMessage] = useState('');
  
    const handleSubmit = (e) => {
      e.preventDefault();
      if (message.trim() !== '') {
        onSendMessage(message);
        setMessage('');
      }
    };
  
    return (
      <div className="text-input-bar">
        <form onSubmit={handleSubmit} className="input-form">
          <div className="input-container">
            <button type="button" className="emoji-button">
              😊
            </button>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="message-input"
            />
            <button type="button" className="attachment-button">
              📎
            </button>
          </div>
          <button type="submit" className="send-button">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="white">
              <path d="M1.101 21.757L23.8 12.028 1.101 2.3l.011 7.912 13.623 1.816-13.623 1.817-.011 7.912z"></path>
            </svg>
          </button>
        </form>
      </div>
    );
  };

function ChatPage({updateAllChat,setAllChats,allChats,handleOnClick,handleBack,chat,currChatUser,currChatUserID,user,onCall,showOutGoing,setIsAddUserOpen,isAddUserOpen}){
    const messagesEndRef = useRef(null);
    const [TextChain,setTextChain] = useState(chat);
    const { initiateCall, connected,sendMessage,messages,setMessages } = useWebSocket();

  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  // useEffect(()=>{
  //   console.log("HERE",chat,currChatUser,currChatUserID,user,onCall,showOutGoing);
  // },[])
  useEffect(() => {
    scrollToBottom();
  }, [TextChain]);
  useEffect(()=>{
    setTextChain(chat);
  },[chat]);
  function updateChats(chats, newId, newData) {
    const existingChatIndex = chats.findIndex(chat => chat.id === newId);
    
    if (existingChatIndex >= 0) {
      // Update existing chat
      return chats.map(chat => 
        chat.id === newId ? { ...chat, data: newData } : chat
      );
    } else {
      // Add new chat
      return [...chats, { id: newId, data: newData }];
    }
  }
  const processedMessagesRef = useRef({});

  function constructMessage(obj) {
    let NewMessage = {
      isUser: false,
      message: obj.message,
      sender: obj.sender,
      timestamp: "5:43 PM"
    }
    return NewMessage;
  }
  
  function updateChats(chats, newId, newData) {
    const existingChatIndex = chats.findIndex(chat => chat.id === newId);
    
    if (existingChatIndex >= 0) {
      return chats.map(chat => 
        chat.id === newId ? { ...chat, data: newData } : chat
      );
    } else {
      return [...chats, { id: newId, data: newData }];
    }
  }
  

  function handleMessages(messages, allChats, setAllChats, setMessages) {

    if (!messages || Object.keys(messages).length === 0) return;
    const updatedAllChats = [...allChats];
    let hasChanges = false;
    const messagesToRemove = [];
    
    for (const messageId in messages) {
      const messageFingerprint = JSON.stringify(messages[messageId]);
      if (processedMessagesRef.current[messageId] === messageFingerprint) {
        continue;
      }
      let matchingChatIndex = -1;
      for (let j = 0; j < updatedAllChats.length; j++) {
        if (updatedAllChats[j].id == messageId) {
          matchingChatIndex = j;
          break;
        }
      }
      if (matchingChatIndex === -1) continue;
      const matchingChat = updatedAllChats[matchingChatIndex];
      if (!matchingChat.data) {
        matchingChat.data = {};
      }
      
      if (!matchingChat.data.chat) {
        matchingChat.data.chat = [];
      }
      const messageArray = messages[messageId];
      
      if (messageArray && messageArray.length > 0) {
        for (let i = 0; i < messageArray.length; i++) {
          if (messageArray[i]) {
            matchingChat.data.chat.push(constructMessage(messageArray[i]));
            hasChanges = true;
          }
        }
        processedMessagesRef.current[messageId] = messageFingerprint;
        messagesToRemove.push(messageId);
      }
    }
    if (hasChanges && setAllChats) {
      setAllChats(updatedAllChats);
    }
    if (messagesToRemove.length > 0 && setMessages) {
      setMessages(prevMessages => {
        const newMessages = {...prevMessages};

        messagesToRemove.forEach(id => {
          delete newMessages[id];
        });
        
        return newMessages;
      });
    }
    
    return updatedAllChats;
  }
  

  useEffect(() => {
    if (Object.keys(messages).length > 0) {
      handleMessages(messages, allChats, setAllChats, setMessages);
    }
    return () => {
      processedMessagesRef.current = {};
    };
  }, [messages, allChats, setAllChats, setMessages]);
// useEffect(() => {
  
//   if (user?.uid && messages[currChatUserID]) {

//     setTextChain(prevChain => [...prevChain, ...messages[currChatUserID]]);
//   }
//   else{
//     for (const messageId in messages) {
      
//       // Find the matching chat by ID
//       let matchingChat = null;
//       for (const j in allChats) {
//         if (allChats[j].id == messageId) {
//           matchingChat = Object.assign({}, allChats[j]);
//           break;
//         }
//       }
      
//       // Skip if no matching chat was found (to maintain original behavior)
//       if (!matchingChat) continue;
      
//       // Add the constructed message to the chat
//       const currentMessage = messages[messageId];
//       matchingChat.data.chat.push(constructMessage(currentMessage[currentMessage.length - 1]));
      
//       // Update chats and save the result
//       const updatedChats = updateChats(allChats, messageId, matchingChat.data.chat);
//       updateAllChat(updatedChats);
//       console.log(allChats);
//     }
//   }
// }, [messages, user?.uid,allChats]);

    function CreateTimeStamp(){
        var AM = 'AM'
        var Tag = String(Date.now());
        var Time = Tag.slice(0,4);
        var Hours = parseInt(Time[0] + Time[1])
        if (Hours >12){
            AM = 'PM';
        }
        var Minutes = Time[2] + Time[3];
        
        return String(Hours%12) + ":"+Minutes+" " + AM;
    }

    function sendMessageChat(text){

        let newText = {
            "sender": user?.uid,
            "message": text,
            "timestamp": CreateTimeStamp(),
            "isUser": true
        }
        const formData = new FormData();
        formData.append("message", text);
        formData.append("timestamp", CreateTimeStamp());
        fetch(BASE_BACK_URL+"/sendText?senderID="+user.uid+"&recieverID="+currChatUserID,{
            method:'PUT',
            body:formData
          })
          .then(res=>res.json())
          .then(data=>console.log(data))
          .catch(error=>console.log(error));

        // console.log(user.uid,currChatUserID);
        sendMessage({
          type: 'message_sent',
          message: newText,
          sender: user?.uid,
          receiver: currChatUserID
        })
        setTextChain([...TextChain,newText]);

        // fetch
    }
    React.useEffect(()=>{
        setTextChain(chat);
    },[chat])
    // React.useEffect(()=>{
    //     console.log(currChatUserID);
    // },[currChatUserID])
    if(currChatUserID!=""){
      return(
        <div className="Page">
        <ChatTopBar handleBack={handleBack} user={currChatUser} onCall={onCall} initiateCall={initiateCall} connected={connected} calledTo={currChatUserID} showOutGoing={showOutGoing}/>
        <div className="chat-container">
            {TextChain.map((obj, idx) => {
                return(
                <div key={idx} className={`chat-message ${obj.isUser ? 'received' : 'sent'}`}>
                    {obj.message}
                    <span className="timestamp">{obj.timestamp}</span>
                </div>
                );
            })}
            <div ref={messagesEndRef} />
        </div>
        
    <TextInputBar onSendMessage={sendMessageChat}/>
  </div>
      );
    }
    // if(width<1000){
    //   return(
    //     <div style={{backgroundColor:'red',width:'100svw',height:'100svh'}}>
    //       <ChatScroll chats={allChats} handleOnClick={updateChats} user={user}/>
    //     </div>
    //   );
    // }
    return(
      
      // <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100%'}}>

      <div className='empty-chat-container'>
        <div className='empty-chat-content'>
          <img 
            src='/chat-placeholder.png' 
            alt='Start chatting' 
            className='empty-chat-illustration'
          />
          <h2>No conversation selected</h2>
          <p>Choose a contact from the sidebar to start chatting</p>
          <div className='empty-chat-actions'>
            <button className='new-chat-button'
              onClick={()=>{setIsAddUserOpen(true)}}
            >
              <span className='icon'>+</span>
              <span>New conversation</span>
            </button>
          </div>
        </div>
      </div>
                  // </div>
    );
}

export default ChatPage;