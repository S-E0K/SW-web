import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import EmotionCategoryPage from './pages/EmotionCategoryPage.jsx';
import TransactionsPage from './pages/TransactionsPage.jsx';
import DateCategoryPage from './pages/DateCategoryPage.jsx';
import FeedbackPage from './pages/FeedbackPage.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/emotion-category" element={<EmotionCategoryPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/date-category" element={<DateCategoryPage />} />
        <Route path="/feedback" element={<FeedbackPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
