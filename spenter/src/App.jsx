import Sidebar from './components/Sidebar';

export default function App() {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* 고정 사이드바 */}
      <div
        style={{
          width: '200px',
          minWidth: '200px',
          backgroundColor: '#222',
          color: '#fff',
          padding: '20px',
          boxSizing: 'border-box',
          flexShrink: 0,
        }}
      >
        <Sidebar />
      </div>

      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <h1 style={{ fontSize: '32px' }}>Spenter에 오신 걸 환영합니다!</h1>
      </div>
    </div>
  );
}
