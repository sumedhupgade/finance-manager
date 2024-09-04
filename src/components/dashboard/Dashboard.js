import React, { useState, useEffect, useCallback } from "react";
import { getTransactions } from "../../services/transactionService";
import AddTransaction from "./AddTransaction";
import TransactionList from "./TransactionList";
const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalInvestment, setTotalInvestment] = useState(0);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const fetchTransactions = useCallback(async () => {
    try {
      const resp = await getTransactions(year, month);
      setTransactions(resp);
      console.log(resp);
    } catch (error) {
      console.log(error);
    }
  }, [year, month]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  useEffect(() => {
      const expenses = transactions
        .filter((transaction) => transaction.type !== "investment")
        .reduce((total, transaction) => total + transaction.amount, 0);
      setTotalExpenses(expenses);
      const investment = transactions
        .filter((transaction) => transaction.type === "investment")
        .reduce((total, transaction) => total + transaction.amount, 0);
      setTotalInvestment(investment);
  }, [transactions]);

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
        {/* <div className="p-4 bg-green-100 text-green-800 rounded shadow">
          <h3 className="text-lg font-semibold">Total Income</h3>
          <p className="text-xl font-bold">20000</p>
        </div> */}
        <div className="p-4 bg-red-100 text-red-800 rounded shadow">
          <h3 className="text-lg font-semibold">Total Expenses</h3>
          <p className="text-xl font-bold">{totalExpenses}</p>
        </div>
        {totalInvestment > 0 && (
          <div className="p-4 bg-blue-100 text-blue-800 rounded shadow">
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

      <div>
        {/* <h3 className="text-xl font-semibold mb-2">Charts</h3> */}
        {/* Placeholder for charts */}
      </div>
    </div>
  );
};
export default Dashboard;
