// ChatBar.jsx
import React, { useEffect, useState } from 'react';
import './Chat.css';
import DummyAvatar from './Untitled.jpeg';
import BASE_BACK_URL from './URL';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddCommentIcon from '@mui/icons-material/AddComment';
import AddUserPopup from './addUser';
import SettingsMenu from './settingsMenu';
import { Drawer } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import SettingsIcon from '@mui/icons-material/Settings';
// import SettingsMenu from './settingsMenu';
function ChatBar({ chat, handleCurrChat, userUID, handleBack }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  async function getUserByID(uid) {
    try {
      const response = await fetch(`${BASE_BACK_URL}/getUser?userId=${uid}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.log("Error fetching user:", error);
      return null;
    }
  }

  useEffect(() => {
    async function loadUser() {
      setIsLoading(true);
      const userData = await getUserByID(userUID);
      setUser(userData);
      setIsLoading(false);
    }
    
    if (userUID) {
      loadUser();
    }
  }, [userUID]);

  // Calculate how long ago the last message was sent
  const getLastMessageTime = () => {
    if (!chat?.data?.timestamp) return '';
    
    const timestamp = new Date(chat.data.timestamp);
    const now = new Date();
    const diffMs = now - timestamp;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays > 0) {
      return diffDays === 1 ? 'Yesterday' : timestamp.toLocaleDateString();
    }
    
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Get the last message preview
  const getLastMessagePreview = () => {
    if (!chat?.data?.chat || chat.data.chat.length === 0) {
      return 'Start a conversation';
    }
    
    const lastMessage = chat.data.chat[chat.data.chat.length - 1];
    // Truncate long messages
    return lastMessage.message.length > 30 
      ? lastMessage.message.substring(0, 27) + '...' 
      : lastMessage.message;
  };

  return (
    <div className='chat-bar' onClick={() => {
      handleCurrChat(chat.data.userId, chat.data.chat, chat.id);
      handleBack(false);
    }}>
      <div className='chat-avatar-container'>
        {isLoading ? (
          <div className='chat-avatar-placeholder'></div>
        ) : (
          <img 
            src={user?.photoURL || DummyAvatar} 
            alt={user?.displayName || 'User'} 
            className='chat-avatar'
            onError={(e) => {e.target.src = DummyAvatar}}
          />
        )}
      </div>
      
      <div className='chat-info'>
        <div className='chat-info-top'>
          <span className='chat-name'>{isLoading ? 'Loading...' : (user?.displayName || 'Unknown User')}</span>
          {/* <span className='chat-time'>{getLastMessageTime()}</span> */}
        </div>
        <div className='chat-info-bottom'>
          <p className='chat-preview'>{getLastMessagePreview()}</p>
          
        </div>
      </div>
    </div>
  );
}

function Header({handleLogout,handleChatClear,deleteUser}) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setIsDrawerOpen(open);
  };
  return(
    <div className='sidebar-header'>
      <div className='sidebar-header-left'>
        <h2>Chats</h2>
      </div>
      <div className='sidebar-header-actions'>
        {/* <button className='header-btn'><SearchIcon /></button> */}
        <button className='header-btn'
          onClick={()=>setIsDrawerOpen(!isDrawerOpen)}
        
        ><MoreVertIcon /></button>
      </div>
      <Drawer
          anchor="right"
          open={isDrawerOpen}
          onClose={()=>setIsDrawerOpen(!isDrawerOpen)}
        >
          <SettingsMenu 
            onClose={()=>setIsDrawerOpen(!isDrawerOpen)}
            onClearChat={handleChatClear}
            handleLogout={handleLogout}
            onDeleteAccount={deleteUser}
          />
        </Drawer>
    </div>
  );
}

function ChatScroll({ chats, handleOnClick, user, handleBack ,setIsAddUserOpen,isAddUserOpen,handleLogout,handleChatClear,deleteUser}) {
  const [results, setResults] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [chatUsers, setChatUsers] = useState({});
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  // Function to get user by ID - use the same one from ChatBar
  async function getUserByID(uid) {
    try {
      const response = await fetch(`${BASE_BACK_URL}/getUser?userId=${uid}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.log("Error fetching user:", error);
      return null;
    }
  }

  // Initialize results with all chats when component mounts or chats change
  useEffect(() => {
    setResults(chats);
  }, [chats]);

  // Fetch user data for all chats to use in search
  useEffect(() => {
    async function fetchAllUsers() {
      if (!chats || chats.length === 0) return;
      
      setIsLoadingUsers(true);
      const userMap = {};
      
      // Create an array of promises to fetch all users in parallel
      const userPromises = chats.map(async (chat) => {
        if (chat.id !== user.uid) {
          const userData = await getUserByID(chat.id);
          if (userData) {
            userMap[chat.id] = userData;
          }
        }
      });
      
      // Wait for all user data to be fetched
      await Promise.all(userPromises);
      setChatUsers(userMap);
      setIsLoadingUsers(false);
    }
    
    fetchAllUsers();
  }, [chats, user.uid]);

  // Search function to filter chats by user display name
  function getSearchResults(input) {
    setSearchInput(input);
    
    if (!input || input.trim() === '') {
      // If search input is empty, show all chats
      setResults(chats);
      return;
    }
    
    const searchTerm = input.toLowerCase().trim();
    
    // Filter chats by user display name
    const filteredChats = chats.filter(chat => {
      // Skip current user's chat
      if (chat.id === user.uid) {
        return false;
      }
      
      // Get the user data for this chat
      const chatUser = chatUsers[chat.id];
      
      // Check if display name includes search term
      return chatUser?.displayName?.toLowerCase().includes(searchTerm);
    });
    
    setResults(filteredChats);
  }

  const handleAddUser = async ({ email, name }) => {
    try {
      // Step 1: Get all users from the endpoint
      const allUsersResponse = await fetch(`${BASE_BACK_URL}/allUsers`);
      if (!allUsersResponse.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const allUsers = await allUsersResponse.json();
      
      // Step 2: Find the user with the matching email
      const matchedUser = allUsers.find(user => user.email.toLowerCase() === email.toLowerCase());
      
      if (!matchedUser) {
        throw new Error('No user found with this email');
      }
      
      // Step 3: Get the UID of the matched user
      const addedUid = matchedUser.uid;
      
      // Step 4: Send the request to add the user
      // Assuming 'user.uid' is the current user's ID (the adder)
      const addUserResponse = await fetch(`${BASE_BACK_URL}/addUser?adder=${user.uid}&added=${addedUid}&userId=${name}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!addUserResponse.ok) {
        throw new Error('Failed to add user to contacts');
      }
      
      // Optional: You could refresh your chat list here
      setResults([...results, {
        id: addedUid, // This should be the added user's ID, not the current user's ID
        data: {
          chat: [],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          userId: name
        }
      }]);
      return true;
    } catch (error) {
      console.error('Error adding user:', error);
      throw error;
    }
  };
  useEffect(() => {
    console.log('Results updated:', results);
  }, [results]);

  // If no chats or filtered results are empty, show empty state
  if (!results || results.length === 0) {
    return (
      <div className='chat-scroll-container'>
        <Header />
        {/* <p>cnsanc</p> */}

        <div className='search-container'>
          <div className='search-input-wrapper'>
            <SearchIcon className='search-icon' />
            <input 
              type="text" 
              placeholder="Search or start a new chat" 
              className='search-input'
              value={searchInput}
              onChange={(e) => getSearchResults(e.target.value)}
            />
          </div>
        </div>
        <div className='no-chats-message'>
          <p>{searchInput ? 'No matching conversations found' : 'No conversations yet'}</p>
          {!searchInput && (
            <button className='start-chat-btn'
            onClick={() => setIsAddUserOpen(true)}
            >
              <AddCommentIcon /> Start a chat
            </button>
          )}
        </div>

        
      </div>
    );
  }

  return (
    <div className='chat-scroll-container'>
      <Header 
      handleLogout={handleLogout} handleChatClear={handleChatClear} deleteUser={deleteUser}
      />
      <div className='search-container'>
        <div className='search-input-wrapper'>
          <SearchIcon className='search-icon' />
          
          <input 
            type="text" 
            placeholder="Search or start a new chat" 
            className='search-input'
            value={searchInput}
            onChange={(e) => getSearchResults(e.target.value)}
          />
        </div>
      </div>
      <div className='chats-list'>
      <AddUserPopup 
        isOpen={isAddUserOpen}
        onClose={() => setIsAddUserOpen(false)}
        onAddUser={handleAddUser}
      />
        {isLoadingUsers && searchInput ? (
          <div className="loading-indicator">Searching...</div>
        ) : (
          results.map((chat, idx) => {
            return (
              `${user.uid}` !== chat.id ? (
                <ChatBar 
                  handleBack={handleBack} 
                  key={idx} 
                  chat={chat} 
                  handleCurrChat={handleOnClick} 
                  userUID={chat.id}
                />
              ) : null
            );
          })
        )}
      </div>
      <div className='new-chat-button-container'>
        <button className='floating-new-chat' 
            onClick={() => setIsAddUserOpen(true)}
        
        >
          <AddCommentIcon />
          
        </button>
      </div>
    </div>
  );
}

export default ChatScroll;