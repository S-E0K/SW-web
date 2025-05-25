// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import EmotionCategoryPage from './pages/EmotionCategoryPage.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/emotion-category" element={<EmotionCategoryPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
