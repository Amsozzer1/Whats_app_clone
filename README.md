# WhatsApp Clone Frontend

A modern real-time messaging application built with React that replicates core WhatsApp functionality with additional video calling features.

[WhatsApp Clone](https://whatsapp-16bff.firebaseapp.com/)


## Features

- **Real-time Messaging**: Instant message delivery using WebSockets
- **User Authentication**: Secure login and registration via Firebase Authentication
- **Video Calling**: High-quality video calls powered by Stream SDK
- **Message History**: Persistent chat history across sessions
- **User Presence**: Online/offline status indicators
- **Responsive Design**: Works on desktop and mobile devices

## Technologies Used

- **React**: Frontend UI library
- **WebSockets**: Real-time bidirectional communication
- **Firebase**: Authentication and data storage
- **Stream Video SDK**: Video calling functionality
- **Node.js**: Backend server for WebSocket handling
- **CSS**: Custom styling for WhatsApp-like interface

## Prerequisites

Before running this project, make sure you have:

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)
- A Firebase account with a configured project
- Stream SDK API keys

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/whatsapp-clone-frontend.git
   cd whatsapp-clone-frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   REACT_APP_FIREBASE_APP_ID=your_firebase_app_id
   
   REACT_APP_STREAM_API_KEY=your_stream_api_key
   
   REACT_APP_WEBSOCKET_URL=your_websocket_server_url
   ```

4. Start the development server:
   ```
   npm start
   ```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Chat/            # Chat interface components
│   ├── Sidebar/         # Contact list and navigation
│   ├── VideoCall/       # Video calling components
│   └── Auth/            # Authentication forms
├── contexts/            # React contexts for state management
├── hooks/               # Custom React hooks
├── services/            # API and service integrations
│   ├── firebase.js      # Firebase configuration
│   ├── websocket.js     # WebSocket connection handling
│   └── stream.js        # Stream SDK integration
├── utils/               # Helper functions
├── App.js               # Main application component
└── index.js             # Application entry point
```

## WebSocket Integration

The application connects to a WebSocket server for real-time messaging. Messages are sent and received in the following format:

```javascript
// Message format
{
  type: "message_sent",
  message: "Hello, world!",
  sender: "user_id_1",
  receiver: "user_id_2"
}
```

WebSocket messages are handled through a custom hook that provides connection state management and message handling:

```javascript
// Example usage of WebSocket hook
const { connected, messages, sendMessage } = useWebSocket();
```

## Video Calling

Video calling is implemented using the Stream Video SDK. The application handles device compatibility across different browsers and platforms, including specific optimizations for Safari and Android.

Key video calling features:
- One-to-one video calls
- Toggle camera and microphone
- Leave call functionality
- Cross-browser compatibility

## Authentication Flow

The application uses Firebase Authentication for user management:

1. User signs up or logs in via Firebase Auth
2. Authentication state is managed through React context
3. Protected routes ensure only authenticated users can access the application
4. User profiles and data are stored in Firebase

## Development Guidelines

- Follow the existing component structure for new features
- Use functional components with hooks
- Maintain responsive design across all screen sizes
- Handle all WebSocket communication through the WebSocket service
- Implement proper error handling for network operations

## Troubleshooting

### Video Calling Issues

If you encounter problems with video calling on specific browsers:

1. For Safari: Make sure the WebRTC adapter is properly initialized
2. For Android: Use the compatibility mode with custom controls
3. Check browser console for specific error messages

### WebSocket Connection Issues

If messages aren't being sent or received:

1. Verify the WebSocket server is running
2. Check your `.env` configuration for the correct WebSocket URL
3. Ensure proper message formatting with JSON.stringify()

## Future Enhancements

- End-to-end encryption for messages
- Group chat functionality
- File and media sharing
- Message search
- Dark mode support

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [React](https://reactjs.org/)
- [Firebase](https://firebase.google.com/)
- [Stream SDK](https://getstream.io/)
- [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)
