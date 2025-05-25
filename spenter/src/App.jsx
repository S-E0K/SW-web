// src/App.jsx
import Sidebar from './components/Sidebar';

export default function App() {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ padding: '20px' }}>
        <h1>홈입니다.</h1>
      </div>
    </div>
  );
}
