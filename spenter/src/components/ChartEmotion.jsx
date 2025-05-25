// src/components/ChartEmotion.jsx
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const data = {
  labels: ['기쁨', '스트레스', '우울함', '충동'],
  datasets: [
    {
      data: [42000, 16000, 13000, 9000],
      backgroundColor: ['#FF6781', '#4DA6FF', '#FFE085', '#92E3F5'],
      borderWidth: 1
    }
  ]
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'top' },
    datalabels: {
      formatter: (value, context) => {
        const total = context.chart._metasets[0].total;
        const percent = ((value / total) * 100).toFixed(1) + '%';
        return percent;
      },
      color: '#000'
    }
  }
};

export default function ChartEmotion() {
  return <Pie data={data} options={options} />;
}
