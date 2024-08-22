"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import Chart from "chart.js/auto";

const HomePage = () => {
  const [month, setMonth] = useState("3");
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statistics, setStatistics] = useState(null);
  const [barChartData, setBarChartData] = useState(null);
  const [pieChartData, setPieChartData] = useState(null);

  useEffect(() => {
    fetchInitialize();
    fetchTransactions();
    fetchStatistics();
    fetchBarChart();
    fetchPieChart();
  }, [month, search, page]);

  const fetchInitialize = async () => {
    await axios.get("/api/initialize");
  };

  const fetchTransactions = async () => {
    const response = await axios.get("/api/transactions", {
      params: { month, search, page },
    });
    console.log(response.data);
    setTransactions(response.data.transactions || []);
    setTotalPages(Math.ceil(response.data.total / 10));
  };

  const fetchStatistics = async () => {
    const response = await axios.get("/api/statistics", { params: { month } });
    setStatistics(response.data);
  };

  const fetchBarChart = async () => {
    const response = await axios.get("/api/bar-chart", { params: { month } });
    setBarChartData({
      labels: response.data.map((item) => item.priceRange),
      datasets: [
        {
          label: "Number of Items",
          data: response.data.map((item) => item.count),
          backgroundColor: "rgba(75, 192, 192, 0.6)",
        },
      ],
    });
  };

  const fetchPieChart = async () => {
    const response = await axios.get("/api/pie-chart", { params: { month } });
    setPieChartData({
      labels: response.data.map((item) => item._id),
      datasets: [
        {
          label: "Categories",
          data: response.data.map((item) => item.count),
          backgroundColor: [
            "rgba(255, 99, 132, 0.6)",
            "rgba(54, 162, 235, 0.6)",
            "rgba(255, 206, 86, 0.6)",
            "rgba(75, 192, 192, 0.6)",
            "rgba(153, 102, 255, 0.6)",
            "rgba(255, 159, 64, 0.6)",
          ],
        },
      ],
    });
  };

  return (
    <div>
      <h1>Transactions Dashboard</h1>
      <div>
        <label>Select Month: </label>
        <select value={month} onChange={(e) => setMonth(e.target.value)}>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>
      </div>
      <div>
        <input
          type="text"
          placeholder="Search transactions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
            <th>Date of Sale</th>
            <th>Category</th>
            <th>Sold</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(transactions) && transactions.length > 0 ? (
            transactions.map((transaction) => (
              <tr key={transaction._id}>
                <td>{transaction.title}</td>
                <td>{transaction.description}</td>
                <td>{transaction.price}</td>
                <td>{new Date(transaction.dateOfSale).toLocaleDateString()}</td>
                <td>{transaction.category}</td>
                <td>{transaction.sold ? "Yes" : "No"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No transactions found</td>
            </tr>
          )}
        </tbody>
      </table>
      <div>
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>
          Previous
        </button>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>

      {statistics && (
        <div>
          <h2>Statistics</h2>
          <p>Total Sale Amount: ${statistics.totalSaleAmount}</p>
          <p>Total Sold Items: {statistics.totalSoldItems}</p>
          <p>Total Not Sold Items: {statistics.totalNotSoldItems}</p>
        </div>
      )}

      {barChartData && (
        <div>
          <h2>Price Range Bar Chart</h2>
          <Bar data={barChartData} />
        </div>
      )}

      {pieChartData && (
        <div>
          <h2>Category Distribution Pie Chart</h2>
          <Pie data={pieChartData} />
        </div>
      )}
    </div>
  );
};

export default HomePage;
