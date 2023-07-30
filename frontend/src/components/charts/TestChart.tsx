import React from "react";
import { ChartData } from "chart.js";
import { Bar } from "react-chartjs-2";

const TestChart = ({ data }: { data: ChartData<"bar", (number | [number, number] | null)[], unknown>}) => {
  return <>
    <Bar data={data} />
  </>;
};

export default TestChart;