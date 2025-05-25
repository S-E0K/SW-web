// src/components/ChartCategory.jsx
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const data = {
  labels: ['식비', '교통', '문화', '쇼핑'],
  datasets: [
    {
      data: [60000, 20000, 18000, 25000],
      backgroundColor: ['#FFA53B', '#A379FF', '#4DD4C6', '#FF6781'],
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

export default function ChartCategory() {
  return <Pie data={data} options={options} />;
}
