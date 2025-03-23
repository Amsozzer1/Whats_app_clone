// SideBar.jsx
import React, { useEffect, useState } from 'react';
import './SideBar.css';
import DummyImage from './Untitled.jpeg';
import { Drawer } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import SettingsIcon from '@mui/icons-material/Settings';
import SettingsMenu from './settingsMenu';

function SideBar({ User,handleLogout,handleChatClear,deleteUser }) {
  const [userAvatar, setUserAvatar] = useState(DummyImage);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    setUserAvatar(User.photoURL);
  }, [User]);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setIsDrawerOpen(open);
  };

  const handleClearChat = () => {
    // Implement your clear chat function here
    console.log('Clear this chat');
  };

  const handleClearAllChats = () => {
    // Implement your clear all chats function here
    console.log('Clear all chats');
  };

  const handleDeleteAccount = () => {
    // Implement your delete account function here
    console.log('Delete account');
  };

  return (
    <div className='bar'>
      <div className='col'>
        <button className='btn-sideBar'>
          <ChatIcon className='icon-style' />
        </button>
      </div>
      <div className='col'>
        <button
          className='btn-sideBar'
          onClick={toggleDrawer(true)}
        >
          <SettingsIcon className='icon-style' />
        </button>
        <button className='btn-sideBar'>
          <img
            src={userAvatar}
            alt={'User avatar'}
            style={{ height: '90%', width: '90%', borderRadius: '50%' }}
          />
        </button>
        <Drawer
          anchor="right"
          open={isDrawerOpen}
          onClose={toggleDrawer(false)}
        >
          <SettingsMenu 
            onClose={toggleDrawer(false)}
            onClearChat={handleChatClear}
            handleLogout={handleLogout}
            onDeleteAccount={deleteUser}
          />
        </Drawer>
      </div>
    </div>
  );
}

export default SideBar;