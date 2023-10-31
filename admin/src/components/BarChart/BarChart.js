// components/BarChart.js
import { Bar } from "react-chartjs-2";
const BarChart = ({ chartData, title, label }) => {
  return (
    <div className="chart-container">
      <h2 style={{ textAlign: "center" }}>{title}</h2>
      <Bar
        data={chartData}
        options={{
          plugins: {
            title: {
              display: false,
              text: label
            },
            legend: {
              display: false
            }
          }
        }}
      />
    </div>
  );
};

export default BarChart;