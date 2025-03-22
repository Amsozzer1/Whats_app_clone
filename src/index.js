import 'react-app-polyfill/stable';
// Now add your custom polyfill for requestIdleCallback
if (!window.requestIdleCallback) {
    window.requestIdleCallback = function(callback, options) {
      const options_or_empty = options || {};
      const timeout = options_or_empty.timeout || 1;
      return setTimeout(function() {
        callback({
          didTimeout: false,
          timeRemaining: function() {
            return Math.max(0, 50);
          }
        });
      }, timeout);
    };
    
    window.cancelIdleCallback = function(id) {
      clearTimeout(id);
    };
  }
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root= ReactDOM.createRoot(document.getElementById('root'));
root.render(
    // <React.StrictMode>
        <App />
    // </React.StrictMode>
    )