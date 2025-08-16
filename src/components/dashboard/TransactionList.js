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
  const [sortConfig, setSortConfig] = React.useState({ key: 'date', direction: "asc" });

  const sortedTransactions = React.useMemo(() => {
    if (!transactions) return [];
    const sortable = [...transactions];
    if (sortConfig.key) {
      sortable.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        // For date, sort as Date objects
        if (sortConfig.key === "date") {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        }
        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sortable;
  }, [transactions, sortConfig]);

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-green-50">
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
      <div className="w-full overflow-x-auto">
        <table className="min-w-full bg-white border rounded text-sm sm:text-base">
          <thead>
            <tr>
              <th className="py-2 px-2 sm:px-4 border-b text-left cursor-pointer whitespace-nowrap" onClick={() => handleSort("amount")}>
                Amount {sortConfig.key === "amount" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
              </th>
              <th className="py-2 px-2 sm:px-4 border-b text-left cursor-pointer whitespace-nowrap" onClick={() => handleSort("type")}>
                Type {sortConfig.key === "type" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
              </th>
              <th className="py-2 px-2 sm:px-4 border-b text-left cursor-pointer whitespace-nowrap" onClick={() => handleSort("date")}>
                Date {sortConfig.key === "date" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
              </th>
              <th className="py-2 px-2 sm:px-4 border-b text-left cursor-pointer whitespace-nowrap" onClick={() => handleSort("description")}>
                Description {sortConfig.key === "description" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
              </th>
              <th className="py-2 px-2 sm:px-4 border-b text-left whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody>
            {sortedTransactions && sortedTransactions.map((transaction, index) => (
              <tr key={transaction._id}>
                <td className="py-2 px-2 sm:px-4 border-b whitespace-nowrap">Rs {transaction.amount}</td>
                <td className="py-2 px-2 sm:px-4 border-b whitespace-nowrap">{transaction.type}</td>
                <td className="py-2 px-2 sm:px-4 border-b whitespace-nowrap">{transaction.date}</td>
                <td className="py-2 px-2 sm:px-4 border-b">{transaction.description}</td>
                <td className="py-2 px-2 sm:px-4 border-b whitespace-nowrap">
                  <button
                    onClick={() => removeTransaction(transaction._id, index)}
                    className="text-red-500 hover:text-red-700"
                    aria-label="Delete"
                  >
                    {/* Bin Icon with fixed border */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <rect x="6" y="7" width="12" height="13" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} stroke="currentColor" d="M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3"/>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} stroke="currentColor" d="M5 7h14"/>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} stroke="currentColor" d="M10 11v6"/>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} stroke="currentColor" d="M14 11v6"/>
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
            {sortedTransactions.length === 0 && (
              <tr>
                <td colSpan="5" className="py-4 text-center text-gray-500">
                  No Transaction Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionList;
