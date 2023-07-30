"use client";

import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import TestChart from "@/components/charts/TestChart";

Chart.register(CategoryScale);

const Home = () => {
    const data = {
        labels: ['Red', 'Orange', 'Blue'],
        datasets: [
            {
                label: 'Popularity of colours',
                data: [55, 23, 96],
                backgroundColor: [
                    'rgba(255, 255, 255, 0.6)',
                    'rgba(255, 255, 255, 0.6)',
                    'rgba(255, 255, 255, 0.6)'
                ],
                borderWidth: 1,
            }
        ]
    }

    return (
        <div>
            Dashboard
            <TestChart data={data} />
        </div>
    );
};

export default Home;
