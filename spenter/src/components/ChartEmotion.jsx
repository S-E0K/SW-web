import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const data = {
  labels: ['기쁨', '스트레스', '우울함', '충동'],
  datasets: [
    {
      data: [50000, 20000, 15000, 11000],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#B4E1FA'],
      borderWidth: 1,
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
    },
    datalabels: {
      formatter: (value, context) => {
        const total = context.chart._metasets[0].total;
        const percentage = ((value / total) * 100).toFixed(1) + '%';
        return percentage;
      },
      color: '#000',
    },
  },
};

export default function ChartEmotion() {
  return (
    <div style={{ width: '600px', height: '600px' }}>
      <Pie data={data} options={options} />
    </div>
  );
}
