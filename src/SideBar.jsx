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

  useEffect(() => {
    setUserAvatar(User.photoURL);
  }, [User]);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setIsDrawerOpen(open);
  };

  const handleClearChat = () => {
    // Implement your clear chat function here
    // console.log('Clear this chat');
    handleChatClear();
  };

  const handleClearAllChats = () => {
    // Implement your clear all chats function here
    // console.log('Clear all chats');
    handleLogout();
  };

  const handleDeleteAccount = () => {
    // Implement your delete account function here
    // console.log('Delete account');
    handleDeleteAccount();
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
            onClearChat={handleLogout}
            onClearAllChats={handleLogout}
            onDeleteAccount={deleteUser}
          />
        </Drawer>
      </div>
    </div>
  );
}

export default SideBar;