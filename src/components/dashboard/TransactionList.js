import React from "react";
import { deleteTransaction } from "../../services/transactionService";
const TransactionList = ({ transactions, handelDelete }) => {
  const removeTransaction = async (id,index) => {
    try {
      await deleteTransaction(id);
      handelDelete(index)
      transactions.splice(index,1)
    } catch (error) {
        console.log(error);
    }
  };
  return (
    <div className="p-4 bg-white rounded shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Recent Transactions</h2>
      <ul>
        {transactions.map((transaction,index) => (
          <li
            key={transaction._id}
            className="flex justify-between items-center py-2 border-b"
          >
            <span>
              {transaction.description} - ${transaction.amount} (
              {transaction.type})
            </span>
            <button
              onClick={() => removeTransaction(transaction._id, index)}
              className="text-red-500 hover:text-red-700"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionList;
