import ChartCategory from '../components/ChartCategory';
import ChartEmotion from '../components/ChartEmotion';
import Sidebar from '../components/Sidebar';

export default function EmotionCategoryPage() {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* 사이드바 */}
      <div style={{ width: '200px', backgroundColor: '#222', color: '#fff', padding: '20px' }}>
        <Sidebar />
      </div>

      {/* 차트 본문 */}
      <div style={{ flex: 1, padding: '40px', display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>
        {/* 감정별 차트 */}
        <div style={{ width: '50%', maxWidth: '700px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h2 style={{ textAlign: 'center' }}>감정별 지출</h2>
          <ChartEmotion />
        </div>

        {/* 카테고리별 차트 */}
        <div style={{ width: '50%', maxWidth: '700px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h2 style={{ textAlign: 'center' }}>카테고리별 지출</h2>
          <ChartCategory />
        </div>
      </div>
    </div>
  );
}
