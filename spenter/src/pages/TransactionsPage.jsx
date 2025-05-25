import Sidebar from '../components/Sidebar';

export default function TransactionsPage() {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: '200px', backgroundColor: '#222', color: '#fff', padding: '20px' }}>
        <Sidebar />
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h2>거래내역 페이지 (추후 구현 예정)</h2>
      </div>
    </div>
  );
}
