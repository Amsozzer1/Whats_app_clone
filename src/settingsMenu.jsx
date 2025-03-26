// SettingsMenu.jsx
import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import LogoutIcon from '@mui/icons-material/Logout';

function SettingsMenu({ onClose, onClearChat, onClearAllChats, onDeleteAccount }) {
  const handleClearChat = () => {
    onClearChat();
    onClose();
  };

  const handleClearAllChats = () => {
    onClearAllChats();
    onClose();
  };

  const handleDeleteAccount = () => {
    onDeleteAccount();
    onClose();
  };

  return (
    <div
      className="settings-drawer"
      role="presentation"
      onClick={onClose}
      onKeyDown={onClose}
    >
      <List>
        <ListItem className="settings-header">
          <ListItemText primary="Settings" />
        </ListItem>
        <Divider />
        <ListItem button onClick={handleClearChat}>
          <ListItemIcon>
            <DeleteIcon />
          </ListItemIcon>
          <ListItemText primary="Clear This Chat" />
        </ListItem>
        <ListItem button onClick={handleClearAllChats}>
          <ListItemIcon>
            <DeleteSweepIcon />
          </ListItemIcon>
          <ListItemText primary="Clear All Chats" />
        </ListItem>
        <Divider />
        <ListItem button onClick={handleDeleteAccount} className="delete-account">
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Delete Your Account" />
        </ListItem>
      </List>
    </div>
  );
}

export default SettingsMenu;