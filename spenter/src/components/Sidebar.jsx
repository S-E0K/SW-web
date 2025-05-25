// src/components/Sidebar.jsx
import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <div style={{
      width: '120px',
      height: '100vh',
      backgroundColor: '#222',
      color: '#fff',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <h3>메뉴</h3>
      <nav>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li>
            <Link to="/emotion-category" style={{ color: '#fff', textDecoration: 'none' }}>
              감정/카테고리 지출
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
