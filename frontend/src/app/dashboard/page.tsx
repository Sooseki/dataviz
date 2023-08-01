"use client";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";

const Home = () => {

    return (
        <div>
            <Breadcrumb items={[
                {
                    label: "Dashboard",
                    path: "/"
                }
            ]} />
            <div className="dashboard">
                <header className="dashboard-header">
                    <h1>Dashboard</h1>
                </header>

                <main className="dashboard-main">
                    <section className="dashboard-section">
                        <h2>Performance Metrics</h2>
                        <div className="performance-metrics">
                            <div className="metric-card">
                                <h3>Page Load Time</h3>
                                <p className="metric-value">2.3s</p>
                                <p className="metric-description">Average time taken to load the page.</p>
                            </div>
                            <div className="metric-card">
                                <h3>Server Response Time</h3>
                                <p className="metric-value">0.8s</p>
                                <p className="metric-description">Average time taken by the server to respond to requests.</p>
                            </div>
                            <div className="metric-card">
                                <h3>Conversion Rate</h3>
                                <p className="metric-value">3.8%</p>
                                <p className="metric-description">Percentage of website visitors who completed a desired action.</p>
                            </div>

                            <div className="metric-card">
                                <h3>Bounce Rate</h3>
                                <p className="metric-value">46%</p>
                                <p className="metric-description">Percentage of visitors who leave the website after viewing only one page.</p>
                            </div>
                            <div className="metric-card">
                                <h3>Average Page Load Time</h3>
                                <p className="metric-value">2.1s</p>
                                <p className="metric-description">Average time it takes for a webpage to load completely.</p>
                            </div>

                            <div className="metric-card">
                                <h3>Server Response Time</h3>
                                <p className="metric-value">120ms</p>
                                <p className="metric-description">Time taken by the server to respond to a request from the browser.</p>
                            </div>

                            <div className="metric-card">
                                <h3>Conversion Rate</h3>
                                <p className="metric-value">3.8%</p>
                                <p className="metric-description">Percentage of website visitors who completed a desired action.</p>
                            </div>

                            <div className="metric-card">
                                <h3>Bounce Rate</h3>
                                <p className="metric-value">46%</p>
                                <p className="metric-description">Percentage of visitors who leave the website after viewing only one page.</p>
                            </div>

                            <div className="metric-card">
                                <h3>Revenue</h3>
                                <p className="metric-value">$1,245</p>
                                <p className="metric-description">Total revenue generated from website sales.</p>
                            </div>

                            <div className="metric-card">
                                <h3>Engagement Score</h3>
                                <p className="metric-value">8.5</p>
                                <p className="metric-description">Measure of user engagement on the website.</p>
                            </div>

                        </div>
                    </section>
                </main>

                <footer className="dashboard-footer">
                    <p>&copy; 2023 Your Dashboard</p>
                </footer>
            </div>
        </div>
    );
};

export default Home;
