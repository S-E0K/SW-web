// src/pages/EmotionCategoryPage.jsx
import ChartEmotion from '../components/ChartEmotion';
import ChartCategory from '../components/ChartCategory';
import Sidebar from '../components/Sidebar';

export default function EmotionCategoryPage() {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          width: '80%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{
            width: '45%',
            textAlign: 'center'
          }}>
            <h2>감정별 지출</h2>
            <div style={{ width: '100%', height: '300px' }}>
              <ChartEmotion />
            </div>
          </div>
          <div style={{
            width: '45%',
            textAlign: 'center'
          }}>
            <h2>카테고리별 지출</h2>
            <div style={{ width: '100%', height: '300px' }}>
              <ChartCategory />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
