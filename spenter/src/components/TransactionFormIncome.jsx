// src/components/TransactionFormIncome.jsx

import React, { useState, useEffect, useRef } from 'react';
import './TransactionFormIncome.css';

const TransactionFormIncome = ({ initialData = null, onSubmit, onCancel }) => {
  // Mã duy nhất của transaction (nếu đang edit)
  const [transactionId, setTransactionId] = useState('');

  // Các field
  const [category, setCategory] = useState('');
  const [detail, setDetail]     = useState('');
  const [amount, setAmount]     = useState('');
  const [date, setDate]         = useState('');

  // Draggable (giống TransactionForm)
  const modalRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset]     = useState({ x: 0, y: 0 });
  const [modalPos, setModalPos] = useState({ top: '50%', left: '50%' });

  // Khởi tạo giá trị khi initialData thay đổi
  useEffect(() => {
    if (initialData) {
      setTransactionId(initialData.transaction_id || '');
      setCategory(initialData.category    || '');
      setDetail  (initialData.detail      || '');
      setAmount  (
        initialData.amount != null
          ? String(initialData.amount)
          : ''
      );
      setDate(initialData.date || '');
    } else {
      setTransactionId('');
      setCategory('');
      setDetail('');
      setAmount('');
      setDate('');
    }
    setModalPos({ top: '50%', left: '50%' });
  }, [initialData]);

  // Các handler cho draggable modal
  const handleMouseDown = e => {
    if (!modalRef.current) return;
    const rect = modalRef.current.getBoundingClientRect();
    setOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setDragging(true);
  };
  const handleMouseMove = e => {
    if (dragging) {
      e.preventDefault();
      setModalPos({
        top:  `${e.clientY - offset.y}px`,
        left: `${e.clientX - offset.x}px`
      });
    }
  };
  const handleMouseUp = () => setDragging(false);
  useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup',   handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup',   handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup',   handleMouseUp);
    };
  }, [dragging, offset]);

  // Khi nhấn nút Lưu
  const handleSubmit = e => {
    e.preventDefault();
    if (!detail.trim() || !category.trim() || !amount.trim() || !date) {
      alert('필수 항목(사용처, 카테고리, 금액, 날짜)을 모두 입력해주세요.');
      return;
    }

    // Gửi lên parent luôn có transaction_id (nếu đang edit)
    onSubmit({
      transaction_id: transactionId,     // sẽ rỗng khi tạo mới
      category:       category.trim(),
      detail:         detail.trim(),
      amount:         parseInt(amount, 10),
      date
    });
  };

  return (
    <div className="transaction-form-backdrop">
      <div
        className="transaction-form-modal"
        ref={modalRef}
        onMouseDown={handleMouseDown}
        style={{
          top:    modalPos.top,
          left:   modalPos.left,
          transform:
            modalPos.top === '50%' && modalPos.left === '50%'
              ? 'translate(-50%, -50%)'
              : 'none',
          position: 'absolute',
          cursor:   dragging ? 'grabbing' : 'grab'
        }}
      >
        <div className="modal-header">
          <h2>
            {transactionId ? '수입 수정' : '수입 추가'}
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="transaction-form">
          <div className="form-group">
            <label>사용처</label>
            <input
              type="text"
              value={detail}
              onChange={e => setDetail(e.target.value)}
              placeholder="예: 알바비, 용돈 등"
              required
            />
          </div>
          <div className="form-group">
            <label>카테고리</label>
            <input
              type="text"
              value={category}
              onChange={e => setCategory(e.target.value)}
              placeholder="예: 아르바이트, 용돈 등"
              required
            />
          </div>
          <div className="form-group">
            <label>금액</label>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="예: 40000"
              required
            />
          </div>
          <div className="form-group">
            <label>날짜</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="submit-btn">등록</button>
            <button type="button" className="cancel-btn" onClick={onCancel}>
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionFormIncome;
