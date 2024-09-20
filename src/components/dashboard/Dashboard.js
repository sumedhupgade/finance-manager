import React, { useState, useEffect, useCallback } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie } from "react-chartjs-2";
import { getTransactions } from "../../services/transactionService";
import AddTransaction from "./AddTransaction";
import TransactionList from "./TransactionList";
import { getDebts } from "../../services/debtService";
import { useNavigate } from "react-router-dom";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalInvestment, setTotalInvestment] = useState(0);
  const [categoryData, setCategoryData] = useState({});
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [totalDebt, setTotalDebt] = useState({
    owed: 0,
    owed_to_you: 0,
  });
  const userInfo = JSON.parse(localStorage.getItem("user"));
  const options = {
    maintainAspectRatio: true,
    aspectRatio: 1,
    plugins: {
      width: "300px",
      legend: {
        display: true,
        responsive: true,
        position: "bottom",
      },
    },
  };

  const navigate = useNavigate();

  const fetchTransactions = useCallback(async () => {
    try {
      const resp = await getTransactions(year, month);
      setTransactions(resp);
    } catch (error) {
      console.error(error);
    }
  }, [year, month]);

  const getUserDebts = useCallback(async () => {
    try {
      const resp = await getDebts();
      console.log(resp);
      let amount = 0;
      let debt = {
        owed: 0,
        owed_to_you: 0,
      };
      resp.forEach((element) => {
        if (element.owed_to === userInfo.id || element.debt_type === "Bank") {
          debt.owed = debt.owed + element.amount;
        }
        amount = amount + element.amount;
      });
      debt.owed_to_you = amount - debt.owed;
      setTotalDebt(debt);
    } catch (error) {}
  }, []);

  useEffect(() => {
    fetchTransactions();
    getUserDebts();
  }, [fetchTransactions, getUserDebts]);

  useEffect(() => {
    const expenses = transactions
      .filter((transaction) => transaction.type !== "investment")
      .reduce((total, transaction) => total + transaction.amount, 0);
    setTotalExpenses(expenses);

    const investment = transactions
      .filter((transaction) => transaction.type === "investment")
      .reduce((total, transaction) => total + transaction.amount, 0);
    setTotalInvestment(investment);

    const categoryTotals = {};
    transactions.forEach((transaction) => {
      const { type, amount, date } = transaction;
      if (!categoryTotals[type]) {
        categoryTotals[type] = 0;
      }
      categoryTotals[type] += amount;
      transaction.date = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(new Date(date));
    });

    setCategoryData({
      labels: Object.keys(categoryTotals),
      datasets: [
        {
          label: "Expenses by Category",
          data: Object.values(categoryTotals),
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
            "#000000".replace(/0/g, function () {
              return (~~(Math.random() * 16)).toString(16);
            }),
            "#000000".replace(/0/g, function () {
              return (~~(Math.random() * 16)).toString(16);
            }),
            "#000000".replace(/0/g, function () {
              return (~~(Math.random() * 16)).toString(16);
            }),
            "#000000".replace(/0/g, function () {
              return (~~(Math.random() * 16)).toString(16);
            }),
            "#000000".replace(/0/g, function () {
              return (~~(Math.random() * 16)).toString(16);
            }),
            "#000000".replace(/0/g, function () {
              return (~~(Math.random() * 16)).toString(16);
            }),
            "#000000".replace(/0/g, function () {
              return (~~(Math.random() * 16)).toString(16);
            }),
            "#000000".replace(/0/g, function () {
              return (~~(Math.random() * 16)).toString(16);
            }),
            "#000000".replace(/0/g, function () {
              return (~~(Math.random() * 16)).toString(16);
            }),
            "#000000".replace(/0/g, function () {
              return (~~(Math.random() * 16)).toString(16);
            }),
            "#000000".replace(/0/g, function () {
              return (~~(Math.random() * 16)).toString(16);
            }),
            "#000000".replace(/0/g, function () {
              return (~~(Math.random() * 16)).toString(16);
            }),
          ],
        },
      ],
    });
  }, [transactions]);

  const navigateToDebts = () => {
    navigate("/debts");
  };

  const handleAddTransaction = (newTransaction) => {
    setTransactions([...transactions, newTransaction]);
  };

  const handelDelete = (index) => {
    let newtransactions = [...transactions];
    newtransactions.splice(index, 1);
    setTransactions(newtransactions);
  };

  // Update the JSX with Tailwind classes
  return (
    <div className="p-4 max-w-screen-lg mx-auto">
      <div className="grid lg:grid-cols-3 gap-4 mb-4">
        <div className="p-4 bg-red-100 text-red-800 rounded shadow">
          <h3 className="text-lg font-semibold">Total Expenses</h3>
          <p className="text-xl font-bold">{totalExpenses}</p>
        </div>
        {(totalDebt.owed > 0 || totalDebt.owed_to_you > 0) && (
          <div
            className="p-4 bg-blue-100 text-blue-800 rounded shadow"
            onClick={navigateToDebts}
          >
            <div className="flex gap-2">
              <h3 className="text-lg font-semibold">Debt Owed</h3>
              <p className="text-xl font-bold">{totalDebt.owed}</p>
            </div>
            <div className="flex gap-2">
              <h3 className="text-lg font-semibold">Debt Owed to you</h3>
              <p className="text-xl font-bold">{totalDebt.owed_to_you}</p>
            </div>
          </div>
        )}
        {totalInvestment > 0 && (
          <div className="p-4 bg-green-100 text-green-800 rounded shadow">
            <h3 className="text-lg font-semibold">Investments</h3>
            <p className="text-xl font-bold">{totalInvestment}</p>
          </div>
        )}
      </div>

      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Add Transactions</h3>
        <AddTransaction handleSave={handleAddTransaction}></AddTransaction>
      </div>
      <div className="mb-4">
        <TransactionList
          transactions={transactions}
          handelDelete={handelDelete}
          handelMonthChange={setMonth}
          handelYearChange={setYear}
          month={month}
          year={year}
        />
      </div>

      <div
        className="p-4 bg-white rounded shadow-lg min-w-fit"
        style={{ width: "fit-content", maxWidth: "100%" }}
      >
        <h3 className="text-xl font-semibold mb-2">Charts</h3>
        {categoryData.labels && categoryData.datasets && (
          <div style={{ minHeight: "200px", maxHeight: "450px" }}>
            <Pie data={categoryData} options={options} />
          </div>
        )}
      </div>
    </div>
  );
};
export default Dashboard;
