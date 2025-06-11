// src/Dashboard.jsx
import Sidebar from '../components/Sidebar';
import AI_AnalyzeForm from '../components/AI_AnalyzeForm';
import Calendar from '../components/Calendar';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';
import ChartEmotion from '../components/ChartEmotion';
import ChartCategory from '../components/ChartCategory';
ChartJS.register(ArcElement, Tooltip, Legend);
import './DashboardStyle.css';


const API_URL = import.meta.env.VITE_API_URL;

export default function DashboardPage({ userId }) {
    const navigate = useNavigate();


    // ← 1) 연·월 상태 추가
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [incomes, setIncomes] = useState([]);
    const [transactions, setTransactions] = useState([]);

    // income, transactions API 호출
    useEffect(() => {
        if (!userId) return;
        const fetchIncomes = async () => {
            const res = await fetch(`${API_URL}/api/income?id=${userId}`);
            if (!res.ok) {
                console.error('fetch incomes failed', await res.text());
                return;
            }
            const data = await res.json();
            // credit 필드만 숫자로 뽑아 배열로 저장 (또는 { amount, … } 형태로)
            setIncomes(data.map(r => Number(r.credit)));
        };

        const fetchTransactions = async () => {
            const res = await fetch(`${API_URL}/api/transactions?id=${userId}`);
            if (!res.ok) {
                console.error('fetch transactions failed', await res.text());
                return;
            }
            const data = await res.json();
            // 마찬가지로 credit 값만 뽑아서 배열로 저장
            setTransactions(data.map(r => Number(r.credit)));
        };

        fetchIncomes();
        fetchTransactions();
    }, [userId]);

    /* Transactions 잔액, 수입, 지출 계산 코드 */
    const totalIncome = incomes.reduce((sum, amt) => sum + amt, 0);
    const totalExpense = transactions.reduce((sum, amt) => sum + amt, 0);
    const balance = totalIncome - totalExpense;

    // ← 2) 차트 연·월 드롭다운 변경 콜백
    const handleDateChange = (newYear, newMonth) => {
        setYear(newYear);
        setMonth(newMonth);
    };






    return (
        <div style={{ display: 'flex', minheight: '100vh' }}>
            <div className="sidebar">
                <Sidebar />
            </div>
            {/* 본문 */}
            <div className='dashboard_container'>
                <div className='dashboard_top'>
                    <div className='Transcations_container'>
                        <div className='Transactions_top' onClick={() => navigate('/transactions')}>
                            거래내역
                        </div>
                        <div className='Transactions-row'>
                            <div className="Transactions_list balance-box">
                                <h3>지출</h3>
                                <p>{totalExpense.toLocaleString()}원</p>
                            </div>
                            <div className="Transactions_list income-box">
                                <h3>수입</h3>
                                <p>{totalIncome.toLocaleString()}원</p>
                            </div>
                            <div className="Transactions_list expense-box">
                                <h3>잔액</h3>
                                <p>{balance.toLocaleString()}원</p>
                            </div>
                        </div>
                        <div className='TransactionsAI_container'>
                            {/* 유저가 직접 입력한 input-text */}
                            <div className="AI_inputTextTitle" style={{ width: '100%' }}>
                                <h2>AI 지출 분석</h2>
                                <hr></hr>
                            </div>
                            <div>
                                <AI_AnalyzeForm userId={userId} />
                            </div>
                        </div>
                    </div>
                    {/* 감정별 지출 차트 */}
                    <div className='EmotionCategory_container'>
                        <div className='Emotion_container'>
                            <div onClick={() => navigate('/emotion-category')}>
                                <h4>감정 별 지출</h4>
                            </div>
                            <hr></hr>
                            <div style={{ width: '80%', height: '300px' }}>
                                <ChartEmotion
                                    userId={userId}
                                    year={year}                      // ← 연·월 props
                                    month={month}
                                    onDateChange={handleDateChange}  // ← 변경 콜백
                                    onSelect={(emotion, details) => {
                                        /* 클릭 시 상세를 다른 곳에 보여주고 싶으면 여기에 */
                                    }}
                                    height="250px"
                                />
                            </div>
                        </div>

                        {/* 카테고리별 지출 차트 */}
                        <div className='Category_container'>
                            <div onClick={() => navigate('/emotion-category')}>
                                <h4>카테고리 별 지출</h4>
                            </div>
                            <hr></hr>
                            <div style={{ width: '80%', height: '300px' }}>
                                <ChartCategory
                                    userId={userId}
                                    year={year}
                                    month={month}
                                    height="250px"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2행: 달력 + AI 피드백 */}
                <div className='dashboard_bottom'>
                    <div className='DateCategory_container'>
                        {/* 날짜 별 지출 (달력) */}
                        <div className='DateCategory_calendar'>
                            <Calendar userId={userId} />
                        </div>
                    </div>
                    <div className='Feedback_container' onClick={() => navigate('/feedback')}>
                        AI 피드백
                    </div>
                </div>
            </div>
        </div>
    );
}