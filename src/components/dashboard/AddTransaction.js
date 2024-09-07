import React, { useState } from "react";
import { addTransactions } from "../../services/transactionService";

const AddTransaction = ({ handleSave }) => {
  const [form, SetForm] = useState({
    type: "Sabji",
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
      handleSave(newTransaction, form);
      SetForm({
        type: "Sabji",
        description: "",
        date: new Date(),
        amount: "",
      });
    } catch (error) {}
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-white rounded shadow-lg mb-4 md:mb-0 grid grid-cols-1 flex-col md:grid-cols-4 md:flex-row gap-4 items-center"
    >
      
      <div className="">
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
      <div className="">
        <select value={form.type} required name="type" onChange={handleChange}
        className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
          <option value="sabji">Sabji</option>
          <option value="kirana">Kirana</option>
          <option value="dudh/dahi">Dudh</option>
          <option value="gadi">Gadi</option>
          <option value="investment">Investment</option>
          <option value="EMI">EMI</option>
          <option value="Credit Card">Credit Card Bill</option>
          <option value="Electricity">Electricity Bill</option>
          <option value="misc">Misc</option>
        </select>
      </div>
      <div className="">
        <input
          type="text"
          placeholder="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
          className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 h-full rounded hover:bg-blue-600"
      >
        Add Transaction
      </button>
    </form>
  );
};

export default AddTransaction;
