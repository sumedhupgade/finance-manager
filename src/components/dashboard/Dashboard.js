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
import { getHoldings } from "../../services/portfolio";
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
  const [totalExpenses, setTotalExpenses] = useState({
    total: 0,
    emi: 0,
    personal: 0,
  });
  const [totalInvestment, setTotalInvestment] = useState(0);
  const [investments, setInvestments] = useState({
    total: 0,
    nps: 0,
    mutualFunds: 0,
    fixedDeposits: 0,
    stocks: 0,
    lic: 0,
    ppf: 0,
  });
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

  const fetchHoldings = useCallback(async () => {
    try {
      const resp = await getHoldings();
      console.log(resp);
    } catch (error) {}
  }, []);

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
    // fetchHoldings();
  }, [fetchTransactions, getUserDebts]);

  useEffect(() => {
    // Calculate expenses
    let expenses = 0,
      emi = 0,
      personal = 0,
      investment = 0;
    const categoryTotals = {};
    const investmentTypes = {
      nps: /nps/i,
      mf: /(mf|sip)/i,
      fd: /fd/i,
      stocks: /stock/i,
      lic: /lic/i,
      ppf: /ppf/i,
    };
    const investmentsCalc = {
      total: 0,
      nps: 0,
      mf: 0,
      fd: 0,
      stocks: 0,
      lic: 0,
      ppf: 0,
    };

    transactions.forEach((t) => {
      const { type, amount, description, date } = t;
      // Format date
      t.date = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(new Date(date));

      // Category totals
      categoryTotals[type] = (categoryTotals[type] || 0) + amount;

      // Expenses
      if (type !== "investment") {
        expenses += amount;
        if (type === "EMI") emi += amount;
        else personal += amount;
      }

      // Investments
      if (type === "investment") {
        investment += amount;
        investmentsCalc.total += amount;
        Object.entries(investmentTypes).forEach(([key, regex]) => {
          if (description && regex.test(description)) {
            investmentsCalc[key] += amount;
          }
        });
      }
    });

    setTotalExpenses({ total: expenses, emi, personal });
    setTotalInvestment(investment);
    setInvestments(investmentsCalc);

    // Pie chart colors
    const baseColors = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"];
    const genColor = () =>
      "#" +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0");
    const colorCount = Object.keys(categoryTotals).length;
    const backgroundColor = [
      ...baseColors,
      ...Array(Math.max(0, colorCount - baseColors.length))
        .fill()
        .map(genColor),
    ].slice(0, colorCount);

    setCategoryData({
      labels: Object.keys(categoryTotals),
      datasets: [
        {
          label: "Expenses by Category",
          data: Object.values(categoryTotals),
          backgroundColor,
        },
      ],
    });
  }, [transactions]);

  const navigateToDebts = () => {
    navigate("/debts");
  };

  const handleAddTransaction = (newTransaction) => {
    setTransactions([newTransaction, ...transactions]);
  };

  const handelDelete = (index) => {
    let newtransactions = [...transactions];
    newtransactions.splice(index, 1);
    setTransactions(newtransactions);
  };

  // Update the JSX with Tailwind classes
  return (
    <div className="p-2 sm:p-4 max-w-screen-xl mx-auto">
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl shadow-lg p-4 sm:p-6 flex flex-col gap-2 sm:gap-4 mb-6">
        <div className="flex sm:flex-row justify-between items-start sm:items-center">
          <h2 className="text-2xl font-bold text-gray-800 sm:mb-2">
            Financial Overview
          </h2>
          <div className="mt-2 text-[13px] text-gray-500">
            {new Date(year, month - 1).toLocaleString("default", {
              month: "short",
            })}
            , {year}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
          {/* Expenses */}
          <div className="flex flex-col items-start flex-1">
            <span className="text-sm font-semibold text-red-600">
              Total Expenses
            </span>
            <span className="text-2xl font-bold text-red-800">
              {totalExpenses.total}
            </span>
            <div className="flex gap-4 mt-2">
              <div>
                <span className="text-[13px] text-red-500">EMI:</span>
                <span className="ml-1 font-semibold text-red-700">
                  {totalExpenses.emi}
                </span>
              </div>
              <div>
                <span className="text-[13px] text-red-500">Personal:</span>
                <span className="ml-1 font-semibold text-red-700">
                  {totalExpenses.personal}
                </span>
              </div>
            </div>
          </div>
          {/* Separator */}
          <div className="sm:mx-4 self-stretch">
            <div className="sm:w-px sm:h-full w-full h-px bg-gray-300"></div>
          </div>
          {/* Debts */}
          {(totalDebt.owed > 0 || totalDebt.owed_to_you > 0) && (
            <div className="flex flex-col items-start flex-1">
              <div className="flex items-center justify-between w-full">
                <span className="text-sm font-semibold text-blue-600">
                  Debts
                </span>
                <button
                  className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition"
                  onClick={navigateToDebts}
                >
                  View
                </button>
              </div>

              <span className="text-2xl font-bold text-blue-800">
                {totalDebt.owed}
              </span>
              <div className="flex gap-4 mt-2 items-center">
                <div>
                  <span className="text-[13px] text-blue-500">
                    Owed to you:
                  </span>
                  <span className="ml-1 font-semibold text-blue-700">
                    {totalDebt.owed_to_you}
                  </span>
                </div>
              </div>
            </div>
          )}
          {/* Separator */}
          {totalInvestment > 0 && (
            <div className="sm:mx-4 self-stretch">
              <div className="sm:w-px sm:h-full w-full h-px bg-gray-300"></div>
            </div>
          )}
          {/* Investments */}
          {investments.total > 0 && (
            <div className="flex flex-col items-start flex-1">
              <span className="text-sm font-semibold text-green-600">
                Investments
              </span>
              <span className="text-2xl font-bold text-green-800">
                {investments.total}
              </span>
              <div className="grid grid-cols-2 gap-x-6 gap-y-1 mt-2 text-[13px]">
                {investments.mf > 0 && (
                  <div className="flex items-center">
                    <span className="text-green-700 font-semibold">
                      Mutual Funds:
                    </span>
                    <span className="ml-1 text-green-800">
                      {investments.mf}
                    </span>
                  </div>
                )}
                {investments.stocks > 0 && (
                  <div className="flex items-center">
                    <span className="text-green-700 font-semibold">
                      Stocks:
                    </span>
                    <span className="ml-1 text-green-800">
                      {investments.stocks}
                    </span>
                  </div>
                )}
                {investments.nps > 0 && (
                  <div className="flex items-center">
                    <span className="text-green-700 font-semibold">NPS:</span>
                    <span className="ml-1 text-green-800">
                      {investments.nps}
                    </span>
                  </div>
                )}
                {investments.ppf > 0 && (
                  <div className="flex items-center">
                    <span className="text-green-700 font-semibold">PPF:</span>
                    <span className="ml-1 text-green-800">
                      {investments.ppf}
                    </span>
                  </div>
                )}
                {investments.fd > 0 && (
                  <div className="flex items-center">
                    <span className="text-green-700 font-semibold">FD:</span>
                    <span className="ml-1 text-green-800">
                      {investments.fd}
                    </span>
                  </div>
                )}
                {investments.lic > 0 && (
                  <div className="flex items-center">
                    <span className="text-green-700 font-semibold">LIC:</span>
                    <span className="ml-1 text-green-800">
                      {investments.lic}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Add Transaction */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl shadow-lg p-4 mb-6">
        <h3 className="text-lg font-semibold mb-2 text-gray-700">
          Add Transaction
        </h3>
        <AddTransaction handleSave={handleAddTransaction} />
      </div>
      {/* Transaction List */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl shadow-lg p-4 mb-6">
        <TransactionList
          transactions={transactions}
          handelDelete={handelDelete}
          handelMonthChange={setMonth}
          handelYearChange={setYear}
          month={month}
          year={year}
        />
      </div>

      {/* Chart */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl shadow-lg p-4">
        <h3 className="text-lg font-semibold mb-2 text-gray-700">
          Expense Breakdown
        </h3>
        {categoryData.labels && categoryData.datasets && (
          <div
            className="flex justify-center items-center"
            style={{ minHeight: "220px", maxHeight: "350px" }}
          >
            <Pie data={categoryData} options={options} />
          </div>
        )}
      </div>
    </div>
  );
};
export default Dashboard;
