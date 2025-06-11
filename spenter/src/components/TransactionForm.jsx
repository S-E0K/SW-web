// src/components/TransactionForm.jsx

import React, { useState, useEffect, useRef } from 'react';
import './TransactionForm.css';

// Danh sách cảm xúc
const EMOTIONS = [
  { key: 'joy', label: '기쁨' },
  { key: 'sad', label: '슬픔' },
  { key: 'stress', label: '스트레스' },
  { key: 'impulse', label: '충동' },
  { key: 'neutral', label: '중립' },
  { key: 'angry', label: '화남' },
];

const TransactionForm = ({ initialData = null, onSubmit, onCancel }) => {
  // State các trường form
  const [category, setCategory] = useState('');
  const [detail, setDetail] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [emotionKey, setEmotionKey] = useState('');    // key như 'joy','sad',...
  const [showEmotionList, setShowEmotionList] = useState(false);

  // === Cho drag modal ===
  const modalRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [modalPos, setModalPos] = useState({ top: '50%', left: '50%' });

  // Prefill hoặc reset khi initialData thay đổi
  useEffect(() => {
    if (initialData && initialData.id != null) {
      setCategory(initialData.category || '');
      setDetail(initialData.detail || '');
      setAmount(
        initialData.amount != null ? String(initialData.amount) : ''
      );
      setDate(initialData.date || '');
      // initialData.emotion là key tiếng Anh
      setEmotionKey(initialData.emotion || '');
    } else {
      setCategory('');
      setDetail('');
      setAmount('');
      setDate('');
      setEmotionKey('');
    }
    // Đặt lại vị trí mỗi khi mở modal mới
    setModalPos({ top: '50%', left: '50%' });
  }, [initialData?.id]);

  const handleMouseDown = (e) => {
    if (modalRef.current) {
      const rect = modalRef.current.getBoundingClientRect();
      setOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      setDragging(true);
    }
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      e.preventDefault();
      setModalPos({
        top: `${e.clientY - offset.y}px`,
        left: `${e.clientX - offset.x}px`
      });
    }
  };

  const handleMouseUp = () => setDragging(false);

  useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, offset]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !detail.trim() ||
      !category.trim() ||
      !amount.trim() ||
      !date ||
      !emotionKey
    ) {
      alert('필수 항목(사용처, 카테고리, 금액, 날짜, 감정)을 모두 입력해주세요.');
      return;
    }
    // Lấy nhãn Hàn của emotion
    const selectedEmotion = EMOTIONS.find(e => e.key === emotionKey);
    onSubmit({
      category: category.trim(),
      detail: detail.trim(),
      amount: parseInt(amount, 10),
      date,
      emotionKor: selectedEmotion?.label,  // ví dụ '기쁨', '슬픔',...
    });
  };

  return (
    <div className="transaction-form-backdrop">
      <div
        className="transaction-form-modal"
        ref={modalRef}
        style={{
          top: modalPos.top,
          left: modalPos.left,
          transform:
            modalPos.top === '50%' && modalPos.left === '50%'
              ? 'translate(-50%, -50%)'
              : 'none',
          position: 'absolute',
          cursor: dragging ? 'grabbing' : 'default',
        }}
      >
        {/* Header draggable */}
        <div
          className="modal-header"
          onMouseDown={handleMouseDown}
          style={{ cursor: 'grab' }}
        >
          <h2 className="modal-title">
            {initialData?.id != null ? '지출 수정' : '지출 추가'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="transaction-form">
          <div className="form-group">
            <label>사용처</label>
            <input
              type="text"
              value={detail}
              onChange={e => setDetail(e.target.value)}
              onMouseDown={e => e.stopPropagation()}
              placeholder="예: 편의점, 영화관 등"
              required
            />
          </div>

          <div className="form-group">
            <label>카테고리</label>
            <input
              type="text"
              value={category}
              onChange={e => setCategory(e.target.value)}
              onMouseDown={e => e.stopPropagation()}
              placeholder="예: 교통/차량, 식비 등"
              required
            />
          </div>

          <div className="form-group">
            <label>금액</label>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              onMouseDown={e => e.stopPropagation()}
              placeholder="예: 4000"
              required
            />
          </div>

          <div className="form-group">
            <label>날짜</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              onMouseDown={e => e.stopPropagation()}
              required
            />
          </div>

          <div className="form-group">
            <label>감정</label>
            <div
              className="emotion-selector"
              onClick={e => { e.stopPropagation(); setShowEmotionList(p => !p); }}
            >
              {emotionKey
                ? EMOTIONS.find(e => e.key === emotionKey)?.label
                : '감정을 선택하세요'}
            </div>
            {showEmotionList && (
              <ul
                className="emotion-list"
                onMouseDown={e => e.stopPropagation()}
              >
                {EMOTIONS.map(emo => (
                  <li
                    key={emo.key}
                    className={
                      emo.key === emotionKey
                        ? 'emotion-item selected'
                        : 'emotion-item'
                    }
                    onClick={() => {
                      setEmotionKey(emo.key);
                      setShowEmotionList(false);
                    }}
                  >
                    {emo.label}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn">
              등록
            </button>
            <button
              type="button"
              className="cancel-btn"
              onClick={onCancel}
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;
