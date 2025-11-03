import React, { memo } from "react";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useSelector } from "react-redux";
import zoomPlugin from "chartjs-plugin-zoom";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  zoomPlugin
);

const colors = [
  "rgba(75,192,192,1)", // teal
  "rgba(255,99,132,1)", // red
  "rgba(54,162,235,1)", // blue
  "rgba(255,206,86,1)", // yellow
  "rgba(153,102,255,1)", // purple
  "rgba(255,159,64,1)", // orange
];

const DemandForecastChart = () => {
  const items = useSelector((store) => store.product.productItems);
  const selectedRows = useSelector((store) => store.product.selectedIds);
  const selectedData = items.filter((row) => selectedRows.includes(row.id));

  // If no data, return empty chart
  if (!selectedData.length) {
    return (
      <div style={{ color: "white", textAlign: "center" }}>
        No products selected
      </div>
    );
  }

  // Get all unique price points and sort them
  const allPrices = new Set();
  selectedData.forEach((product) => {
    if (
      product.selling_price_range &&
      Array.isArray(product.selling_price_range)
    ) {
      product.selling_price_range.forEach((price) =>
        allPrices.add(Number(price))
      );
    }
  });

  const sortedPrices = Array.from(allPrices).sort((a, b) => a - b);

  const data = {
    labels: sortedPrices,
    datasets: selectedData.map((product, index) => {
      // For each price point, find corresponding demand or interpolate
      const demandData = sortedPrices.map((price) => {
        if (!product.selling_price_range || !product.demand_range) return 0;

        const priceIndex = product.selling_price_range.indexOf(price);
        if (priceIndex !== -1) {
          // Exact price match found
          return product.demand_range[priceIndex] || 0;
        }

        // Interpolate between closest points
        const prices = product.selling_price_range.map((p) => Number(p));
        const demands = product.demand_range.map((d) => Number(d));

        // Find surrounding points
        let lowerIdx = -1,
          upperIdx = -1;
        for (let i = 0; i < prices.length; i++) {
          if (prices[i] <= price) lowerIdx = i;
          if (prices[i] >= price && upperIdx === -1) upperIdx = i;
        }

        if (lowerIdx === -1) return demands[0] || 0;
        if (upperIdx === -1) return demands[demands.length - 1] || 0;
        if (lowerIdx === upperIdx) return demands[lowerIdx] || 0;

        // Linear interpolation
        const x1 = prices[lowerIdx],
          y1 = demands[lowerIdx];
        const x2 = prices[upperIdx],
          y2 = demands[upperIdx];
        const interpolated = y1 + ((price - x1) / (x2 - x1)) * (y2 - y1);

        return Math.round(interpolated);
      });

      return {
        label: product.name,
        data: demandData,
        borderColor: colors[index % colors.length],
        backgroundColor: colors[index % colors.length],
        fill: false,
        tension: 0.2,
      };
    }),
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "white",
          font: { size: 12, weight: "bold" },
        },
      },
      title: {
        display: true,
        text: "Demand Forecast Curve",
        color: "white",
      },
      zoom: {
        pan: { enabled: true, mode: "xy" },
        zoom: {
          wheel: { enabled: true },
          pinch: { enabled: true },
          mode: "xy",
        },
      },
    },
    scales: {
      x: {
        title: { display: true, text: "Selling Price", color: "white" },
        ticks: { color: "white" },
        type: "linear",
      },
      y: {
        title: { display: true, text: "Demand", color: "white" },
        ticks: { color: "white" },
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default memo(DemandForecastChart);
