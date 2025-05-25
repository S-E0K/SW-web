import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <h2 style={{ margin: 0, fontSize: '20px' }}>메뉴</h2>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
        <Link to="/" style={linkStyle}>대시보드</Link>
        <Link to="/transactions" style={linkStyle}>거래내역</Link>
        <Link to="/emotion-category" style={linkStyle}>감정/카테고리 별 지출</Link>
        <Link to="/date-category" style={linkStyle}>날짜 별 지출</Link>
        <Link to="/feedback" style={linkStyle}>피드백</Link>
      </nav>
    </div>
  );
}

const linkStyle = {
  color: 'white',
  textDecoration: 'none',
  fontSize: '16px',
  fontWeight: 'bold',
};
