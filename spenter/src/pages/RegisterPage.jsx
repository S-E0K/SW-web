import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';

const dummyUsers = []; // 💾 DB 대신 임시 사용자 저장 배열

export default function RegisterPage() {
  const [id, setId] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();

    const isIdDuplicate = dummyUsers.some(user => user.id === id);
    const isUsernameDuplicate = dummyUsers.some(user => user.username === username);

    if (isIdDuplicate) {
      setMessage('이미 존재하는 ID입니다.');
      return;
    }
    if (isUsernameDuplicate) {
      setMessage('이미 존재하는 Username입니다.');
      return;
    }

    dummyUsers.push({ id, username, password });
    setMessage('회원가입이 완료되었습니다!');
    setId('');
    setUsername('');
    setPassword('');
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: '200px', backgroundColor: '#222', color: '#fff', padding: '20px' }}>
        <Sidebar />
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', width: '300px', gap: '15px' }}>
          <h2 style={{ textAlign: 'center' }}>회원가입</h2>
          <input type="text" placeholder="ID" value={id} onChange={(e) => setId(e.target.value)} required />
          <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit">가입하기</button>
          {message && <div style={{ textAlign: 'center', color: 'red' }}>{message}</div>}
        </form>
      </div>
    </div>
  );
}
