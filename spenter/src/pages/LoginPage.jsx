import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const dummyUsers = [
  { id: 'user1', username: '지원이', password: '1234' },
  { id: 'testuser', username: '홍길동', password: 'abcd' },
];

export default function LoginPage() {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const user = dummyUsers.find(u => u.id === id && u.password === pw);
    if (user) {
      localStorage.setItem('loggedInUsername', user.username); // 로그인 사용자 저장
      navigate('/dashboard'); // 대시보드로 이동
    } else {
      setMessage('ID 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <form onSubmit={handleLogin} style={{ width: '300px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <h2 style={{ textAlign: 'center' }}>로그인</h2>
        <input type="text" placeholder="ID" value={id} onChange={(e) => setId(e.target.value)} required />
        <input type="password" placeholder="Password" value={pw} onChange={(e) => setPw(e.target.value)} required />
        <button type="submit">로그인</button>
        {message && <div style={{ textAlign: 'center', color: 'red' }}>{message}</div>}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
          <button type="button" style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer' }}>
            ID/PW 찾기
          </button>
          <button type="button" style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer' }}
            onClick={() => navigate('/register')}>
            회원가입
          </button>
        </div>
      </form>
    </div>
  );
}
