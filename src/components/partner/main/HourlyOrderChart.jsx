import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
} from 'chart.js';

import { getHourlyStatsThunk } from '../../../store/thunks/orders/orderStatsThunk.js';
import './HourlyOrderChart.css'; // ✅ CSS 모듈 import

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

const HourlyOrderChart = () => {
  const dispatch = useDispatch();
  const { stats, loading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(getHourlyStatsThunk());
  }, [dispatch]);

  const chartData = {
    labels: stats.map((d) => d.hour),
    datasets: [{
      label: '주문 건수',
      data: stats.map((d) => d.count),
      backgroundColor: 'rgba(54, 162, 235, 0.6)',
      hoverBackgroundColor: 'rgba(54, 162, 235, 0.8)',
      borderRadius: 6,
      barThickness: 25,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        padding: { bottom: 15 }
      }
    },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true, ticks: { stepSize: 1 } }
    }
  };

  // 로딩 중 UI
  if (loading && stats.length === 0) {
    return (
      <div className={styles.chartContainer}>
        <div className={styles.loadingWrapper}>
          <div className={styles.loadingSpinner}></div>
          <p>데이터를 불러오는 중입니다...</p>
        </div>
      </div>
    );
  }

  // 데이터 없음 UI
  if (!loading && stats.length === 0) {
    return (
      <div className={styles.chartContainer}>
        <div className={styles.noDataWrapper}>
          <div className={styles.noDataIcon}>☕</div>
          <p>오늘 기록된 주문 데이터가 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.chartContainer}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default HourlyOrderChart;