// SettingsMenu.jsx
import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import LogoutIcon from '@mui/icons-material/Logout';

function SettingsMenu({ onClose, onClearChat, handleLogout, onDeleteAccount }) {
  const handleClearChat = () => {
    onClearChat();
    // onClose();
  };

  const handleClearAllChats = () => {
    handleLogout();
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
        <ListItem button onClick={onClearChat}>
          <ListItemIcon>
            <DeleteIcon />
          </ListItemIcon>
          <ListItemText primary="Clear Chats" />
        </ListItem>
        <ListItem button onClick={onClearChat}>
          <ListItemIcon>
            <DeleteSweepIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
        <Divider />
        <ListItem button onClick={onDeleteAccount} className="delete-account">
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