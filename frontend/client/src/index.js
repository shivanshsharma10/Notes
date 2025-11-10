import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // <-- Makes sure it imports App.js

const root = ReactDOM.createRoot(document.getElementById('root')); // <-- Finds the "root" div
root.render(
  <React.StrictMode>
    <App /> 
  </React.StrictMode>
);