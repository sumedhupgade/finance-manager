import React from "react";
import { deleteTransaction } from "../../services/transactionService";
const TransactionList = ({
  transactions,
  handelDelete,
  handelMonthChange,
  handelYearChange,
  month,
  year,
}) => {
  const removeTransaction = async (id, index) => {
    try {
      await deleteTransaction(id);
      handelDelete(index);
      transactions.splice(index, 1);
    } catch (error) {}
  };
  return (
    <div className="p-4 bg-white rounded shadow-lg">
      <div className="flex sm:flex-row mb-4 flex-col align-center sm:gap-2 gap-1">
        <h2 className="text-2xl font-bold">Recent Transactions</h2>
        <div className="sm:ml-auto flex gap-2">
          <select
            style={{ width: "100px", height: "32px" }}
            name="type"
            value={month}
            onChange={(e) => handelMonthChange(e.target.value)}
            className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          >
            <option value="1">Jan</option>
            <option value="2">Feb</option>
            <option value="3">March</option>
            <option value="4">April</option>
            <option value="5">May</option>
            <option value="6">June</option>
            <option value="7">July</option>
            <option value="8">Aug</option>
            <option value="9">Sept</option>
            <option value="10">Oct</option>
            <option value="11">Nov</option>
            <option value="12">Dec</option>
          </select>
          <select
            style={{ width: "100px", height: "32px" }}
            name="type"
            value={year}
            onChange={(e) => handelYearChange(e.target.value)}
            className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          >
            <option value="2020">2020</option>
            <option value="2021">2021</option>
            <option value="2022">2022</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
            <option value="2026">2026</option>
            <option value="2027">2027</option>
            <option value="2028">2028</option>
            <option value="2029">2029</option>
            <option value="2030">2030</option>
            <option value="2031">2031</option>
          </select>
        </div>
      </div>
      <ul>
        {transactions &&
          transactions.map((transaction, index) => (
            <li
              key={transaction._id}
              className="flex justify-between items-start py-2 border-b"
            >
              <span className="pr-1">
                Rs {transaction.amount} ({transaction.type}) - {transaction.date} -{" "}
                {transaction.description} 
              </span>
              <button
                onClick={() => removeTransaction(transaction._id, index)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </li>
          ))}

        {transactions.length === 0 && (
          <div className="empty-state">No Transaction Found</div>
        )}
      </ul>
    </div>
  );
};

export default TransactionList;
