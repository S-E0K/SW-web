// src/components/TransactionsPage.jsx

import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import TransactionForm from '../components/TransactionForm';
import TransactionFormIncome from '../components/TransactionFormIncome';
import './TransactionsStyle.css';

const API_URL = import.meta.env.VITE_API_URL;

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [incomes, setIncomes]           = useState([]);
  const [showIncomeList, setShowIncomeList] = useState(false);
  const [showForm, setShowForm]             = useState(false);
  const [formType, setFormType]             = useState('expense'); // 'expense' | 'income'
  const [editingData, setEditingData]       = useState(null);

  const formatDate = ds => {
    const d = new Date(ds);
    return `${d.getFullYear()}년 ${d.getMonth()+1}월 ${d.getDate()}일`;
  };

  // --- FETCHES ---
  const fetchTransactions = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;
    const res = await fetch(`${API_URL}/api/transactions?id=${userId}`);
    if (!res.ok) return console.error('Fetch transactions failed', await res.text());
    const data = await res.json();
    setTransactions(data.map(r => ({
      id:       r.AI_id,
      date:     r.credit_date,
      category: r.use_category,
      detail:   r.use_place,
      amount:   Number(r.credit),
      emotion:  r.emotion || '중립',
    })));
  };

  const fetchIncomes = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;
    const res = await fetch(`${API_URL}/api/income?id=${userId}`);
    if (!res.ok) return console.error('Fetch incomes failed', await res.text());
    const data = await res.json();
    setIncomes(data.map(r => ({
      transaction_id: r.transaction_id,
      id:             r.id,
      date:           r.credit_date,
      category:       r.use_category,
      detail:         r.use_place,
      amount:         Number(r.credit),
    })));
  };

  useEffect(() => {
    fetchTransactions();
    fetchIncomes();
  }, []);

  // --- UI handers ---
  const handleShowIncomes    = () => setShowIncomeList(true);
  const handleBackToExpenses = () => setShowIncomeList(false);

  const handleAddExpense  = () => { setFormType('expense'); setEditingData(null); setShowForm(true); };
  const handleEditExpense = tx   => { setFormType('expense'); setEditingData(tx);   setShowForm(true); };

  const handleAddIncome  = () => { setFormType('income'); setEditingData(null); setShowForm(true); };
  const handleEditIncome = inc  => { setFormType('income'); setEditingData(inc);   setShowForm(true); };

  // --- DELETE / PUT for incomes using URL param ---
  const handleDeleteIncome = async inc => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    console.log('Deleting income id=', inc.transaction_id);
    const res = await fetch(`${API_URL}/api/income/${inc.transaction_id}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const err = await res.text();
      console.error('Delete failed:', res.status, err);
      alert(`Xóa thất bại: ${err}`);
    } else {
      fetchIncomes();
    }
  };

  const handleIncomeSubmit = async formData => {
    const userId = localStorage.getItem('userId');
    const base = {
      id:           userId,
      credit:       Number(formData.amount),
      use_place:    formData.detail,
      use_category: formData.category,
      credit_date:  formData.date
    };

    if (formData.transaction_id) {
      // PUT /api/income/:transaction_id
      console.log('Updating income', formData.transaction_id, base);
      const res = await fetch(`${API_URL}/api/income/${formData.transaction_id}`, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(base)
      });
      if (!res.ok) {
        const err = await res.text();
        console.error('Update failed:', res.status, err);
        alert(`Cập nhật thất bại: ${err}`);
      } else {
        setShowForm(false);
        setEditingData(null);
        fetchIncomes();
      }
    } else {
      // POST /api/income
      console.log('Creating income', base);
      const res = await fetch(`${API_URL}/api/income`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(base)
      });
      if (!res.ok) {
        const err = await res.text();
        console.error('Create failed:', res.status, err);
        alert(`Tạo mới thất bại: ${err}`);
      } else {
        setShowForm(false);
        setEditingData(null);
        fetchIncomes();
      }
    }
  };

  // Chi tiêu giữ nguyên
  const handleDeleteExpense = async txId => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    await fetch(`${API_URL}/api/transactions/${txId}`, { method: 'DELETE' });
    fetchTransactions();
  };
  const handleExpenseSubmit = async formData => {
    const userId = localStorage.getItem('userId');
    const payload = {
      id:           userId,
      emotion:      formData.emotionKor,
      use_place:    formData.detail,
      use_category: formData.category,
      credit:       Number(formData.amount),
      credit_date:  formData.date
    };
    const isEdit = Boolean(editingData);
    const url    = isEdit
      ? `${API_URL}/api/transactions/${editingData.id}`
      : `${API_URL}/api/transactions`;
    const res = await fetch(url, {
      method:  isEdit ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload)
    });
    if (res.ok) {
      setShowForm(false);
      setEditingData(null);
      fetchTransactions();
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingData(null);
  };

  // Summary
  const totalExpense = transactions.reduce((s, tx) => s + tx.amount, 0);
  const totalIncome  = incomes.reduce((s, inc) => s + inc.amount, 0);
  const balance      = totalIncome - totalExpense;

  return (
    <div className="page-container" style={{ display:'flex', minHeight:'100vh' }}>
      <div className="sidebar"><Sidebar /></div>
      <div className="Transactions-container">
        {/* summary */}
        <div className="summary-row">
          <div className="summary-box expense-box">
            <h3>지출</h3>
            <p>{totalExpense.toLocaleString()}원</p>
          </div>
          <div className="summary-box income-box" style={{ position:'relative' }}>
            <h3>수입</h3>
            <p>{totalIncome.toLocaleString()}원</p>
            <div style={{ position:'absolute', top:8, right:8, display:'flex', gap:4 }}>
              <button onClick={handleAddIncome}>＋</button>
              <button onClick={handleShowIncomes}>✎</button>
            </div>
          </div>
          <div className="summary-box balance-box">
            <h3>잔액</h3>
            <p>{balance.toLocaleString()}원</p>
          </div>
        </div>

        {/* expenses */}
        {!showIncomeList && (
          <div className="Transactions-list-container">
            <div className="Transactions-list-header">
              <h2>출금 내역</h2>
              <button onClick={handleAddExpense}>＋</button>
            </div>
            <div className="Transactions-list-box">
              {transactions.length ? transactions.map(tx => (
                <div key={tx.id} className="Transactions-box-row expense-row">
                  <span>{formatDate(tx.date)}</span>
                  <span>{tx.category}</span>
                  <span>{tx.detail}</span>
                  <span className="Tr-emotion">{tx.emotion}</span>
                  <span className="Tr-amount expense-amount">−{tx.amount.toLocaleString()}원</span>
                  <div className="Tr-actions">
                    <button onClick={()=>handleEditExpense(tx)}>✎</button>
                    <button onClick={()=>handleDeleteExpense(tx.id)}>🗑</button>
                  </div>
                </div>
              )) : (
                <p style={{textAlign:'center', padding:'20px 0'}}>거래 내역이 없습니다.</p>
              )}
            </div>
          </div>
        )}

        {/* incomes */}
        {showIncomeList && (
          <div className="Transactions-list-container">
            <div className="Transactions-list-header">
              <button onClick={handleBackToExpenses}>← 돌아가기</button>
              <h2>수입 내역</h2>
              <button onClick={handleAddIncome}>＋</button>
            </div>
            <div className="Transactions-list-box">
              {incomes.length ? incomes.map(inc => (
                <div key={inc.transaction_id} className="Transactions-box-rowIncome income-row">
                  <span>{formatDate(inc.date)}</span>
                  <span>{inc.category}</span>
                  <span>{inc.detail}</span>
                  <span className="Tr-amount income-amount">＋{inc.amount.toLocaleString()}원</span>
                  <div className="Tr-actions">
                    <button onClick={()=>handleEditIncome(inc)}>✎</button>
                    <button onClick={()=>handleDeleteIncome(inc)}>🗑</button>
                  </div>
                </div>
              )) : (
                <p style={{textAlign:'center', padding:'20px 0'}}>수입 내역이 없습니다.</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* modal */}
      {showForm && formType==='expense' && (
        <TransactionForm
          initialData={editingData}
          onSubmit={handleExpenseSubmit}
          onCancel={handleFormCancel}
        />
      )}
      {showForm && formType==='income' && (
        <TransactionFormIncome
          initialData={editingData}
          onSubmit={handleIncomeSubmit}
          onCancel={handleFormCancel}
        />
      )}
    </div>
  );
}
