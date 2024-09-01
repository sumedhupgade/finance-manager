import React, { useState } from "react";
import { addTransactions } from "../../services/transactionService";

const AddTransaction = ({ handleSave }) => {
  const [form, SetForm] = useState({
    type: "expense",
    description: "",
    date: new Date(),
    amount: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    SetForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      SetForm({ ...form, date: new Date() });
      const newTransaction = await addTransactions(form);
      console.log(newTransaction);
      handleSave(newTransaction, form);
      SetForm({
        type: "expense",
        description: "",
        date: new Date(),
        amount: "",
      });
    } catch (error) {}
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-white rounded shadow-lg mb-6"
    >
      <div className="mb-4">
        <input
          type="text"
          placeholder="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
          required
          className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />
      </div>
      <div className="mb-4">
        <input
          type="number"
          placeholder="Amount"
          name="amount"
          value={form.amount}
          onChange={handleChange}
          required
          className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />
      </div>
      <div className="mb-4">
        <select value={form.type} required name="type" onChange={handleChange}
        className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
          <option value="expense">Expense</option>
          <option value="income">Income</option>
          <option value="investment">Investment</option>
        </select>
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        Add Transaction
      </button>
    </form>
  );
};

export default AddTransaction;
