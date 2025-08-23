import React, { useState, useEffect, useCallback } from "react";
import { getDebts, addDebt, deleteDebt } from "../../services/debtService";
import { getUsers } from "../../services/userService";
import LoanEMICalculator from "./EMICalculator";

const Debts = () => {
  const userInfo = JSON.parse(localStorage.getItem("user"));
  const [debt, setDebt] = useState([]);
  const [users, setUsers] = useState([]);
  const [loanDetails, setLoanDetails] = useState({});
  const [debtForm, setDebtForm] = useState({
    name: "",
    amount: "",
    debt_type: "Personal",
    emi_amount: "",
    outstanding_amount: "",
    owed_to: userInfo.id,
    startDate: new Date().toISOString().split("T")[0], // Default to today
    endDate: "",
    emiDate: "",
    interestRate: "",
    transactions: [],
    tenure: "",
  });

  const fetchDebts = useCallback(async () => {
    try {
      const resp = await getDebts();
      setDebt(resp);
    } catch (error) {}
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const resp = await getUsers();
      setUsers(resp);
      setDebtForm({
        ...debtForm,
        owed_to: userInfo.id,
      });
    } catch (error) {}
  }, []);

  const getUserNameById = (userId) => {
    const user = users.find((user) => user._id === userId);
    return user ? user.username : "Bank"; // Fallback if user not found
  };

  useEffect(() => {
    fetchDebts();
    fetchUsers();
  }, [fetchDebts, fetchUsers]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDebtForm({
      ...debtForm,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resp = await addDebt(debtForm);
      setDebt((prevDebts) => [...prevDebts, { ...debtForm, _id: resp._id }]);
      setDebtForm({
        name: "",
        amount: "",
        debt_type: "Personal",
        emi_amount: "",
        outstanding_amount: "",
        owed_to: "",
        startDate: "",
        endDate: "",
        emiDate: "",
        tenure: "",
        interestRate: "",
        transactions: [],
      });
    } catch (error) {}
  };

  const removeTransaction = async (id, index) => {
    try {
      await deleteDebt(id);
      setDebt((prevDebts) => prevDebts.filter((_, i) => i !== index));
    } catch (error) {}
  };

  const handleDebtChange = (updatedDebt) => {
    setDebt((prevDebts) =>
      prevDebts.map((d) => (d._id === updatedDebt._id ? updatedDebt : d))
    );
    if (loanDetails._id === updatedDebt._id) {
      setLoanDetails(updatedDebt);
    }
  };

  const hideLoanDetails = () => {
    setLoanDetails({});
  };

  const totalDebtOwedByMe = debt
    .filter((d) => d.owed_to === userInfo.id || d.debt_type === "Bank")
    .reduce((sum, d) => sum + Number(d.amount || 0), 0);
  const totalDebtOwedToMe = debt
    .filter((d) => d.owed_to !== userInfo.id && d.debt_type === "Personal")
    .reduce((sum, d) => sum + Number(d.amount || 0), 0);

  return (
    <div className="p-2 sm:p-4 max-w-screen-xl mx-auto gap-4 flex flex-col">
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl shadow-lg p-4 sm:p-6 flex flex-col gap-2 sm:gap-4 w-full">
        <div className="flex sm:flex-row justify-between items-start sm:items-center">
          <h2 className="text-2xl font-bold text-gray-800">Debt Overview</h2>
        </div>

        {/* <div className="flex flex-col sm:flex-row gap-3 sm:gap-6"> */}
        <div className="flex flex-col items-start flex-1">
          <div className="flex flex-col gap-2">
            <div>
              <span className="text-[13px] text-red-500">Owed By Me:</span>
              <span className="ml-1 font-semibold text-red-700">
                {totalDebtOwedByMe}
              </span>
            </div>
            <div>
              <span className="text-[13px] text-red-500">Owed to me:</span>
              <span className="ml-1 font-semibold text-red-700">
                {totalDebtOwedToMe}
              </span>
            </div>
          </div>
        </div>

        {/* </div> */}
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl shadow-lg p-4 sm:p-6 w-full">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Add Debt
          </h2>
        </div>
        <form
          onSubmit={handleSubmit}
          className="p-4 grid grid-cols-1 sm:grid-cols-5 gap-4 items-center "
        >
          <div className="flex flex-col gap-1">
            <label
              htmlFor="name"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Name
            </label>
            <input
              type="text"
              placeholder="Name"
              id="name"
              name="name"
              value={debtForm.name}
              onChange={handleChange}
              required
              className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label
              htmlFor="debt_type"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Debt Type
            </label>
            <select
              value={debtForm.debt_type}
              required
              name="debt_type"
              id="debt_type"
              onChange={handleChange}
              className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            >
              <option value="Bank">Bank</option>
              <option value="Personal">Personal</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label
              htmlFor="amount"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Amount
            </label>
            <input
              type="number"
              placeholder="Amount"
              id="amount"
              name="amount"
              value={debtForm.amount}
              onChange={handleChange}
              required
              className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>

          {debtForm.debt_type !== "Bank" && (
            <div className="flex flex-col gap-1">
              <label
                htmlFor="owed_to"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Owed By
              </label>
              <select
                value={debtForm.owed_to}
                required
                name="owed_to"
                id="owed_to"
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                {users &&
                  users.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.username}
                    </option>
                  ))}
                <option value="Others">Others</option>
              </select>
            </div>
          )}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="startDate"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              {debtForm.debt_type === "Bank"
                ? "Start Date"
                : "Transaction Date"}
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={debtForm.startDate}
              onChange={handleChange}
              className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
          {debtForm.debt_type === "Bank" && (
            <>
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="emi"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  EMI Amount
                </label>
                <input
                  type="text"
                  placeholder="EMI"
                  id="emi"
                  name="emi_amount"
                  value={debtForm.emi_amount}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="outstanding"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Outstanding Amount
                </label>
                <input
                  type="text"
                  placeholder="Outstanding Amount"
                  id="outstanding"
                  name="outstanding_amount"
                  value={debtForm.outstanding_amount}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="emiDate"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Recurring EMI Date
                </label>
                <input
                  type="string"
                  id="emiDate"
                  name="emiDate"
                  value={debtForm.emiDate}
                  placeholder="15 (of every month)"
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="interest"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Interest Rate
                </label>
                <input
                  type="string"
                  id="interest"
                  name="interestRate"
                  placeholder="10%"
                  value={debtForm.interestRate}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="tenure"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Remaining Tenure
                </label>
                <input
                  type="string"
                  id="tenure"
                  name="tenure"
                  placeholder="12 (months)"
                  value={debtForm.tenure}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 h-full rounded hover:bg-blue-600"
          >
            Add Debt
          </button>
        </form>
      </div>
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl shadow-lg p-4 sm:p-6 w-full">
        <h2 className="text-2xl font-bold">Debt Transactions</h2>

        {debt &&
          debt.map((debt, index) => (
            <div
              className="flex justify-between items-start py-2 border-b"
              key={debt._id}
              onClick={() => setLoanDetails(debt)}
            >
              {debt.amount} - {getUserNameById(debt.owed_to)}
              <button
                onClick={() => removeTransaction(debt._id, index)}
                className="text-red-500 hover:text-red-700"
                aria-label="Delete"
              >
                {/* Bin Icon with fixed border */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 inline"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <rect
                    x="6"
                    y="7"
                    width="12"
                    height="13"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    stroke="currentColor"
                    d="M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    stroke="currentColor"
                    d="M5 7h14"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    stroke="currentColor"
                    d="M10 11v6"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    stroke="currentColor"
                    d="M14 11v6"
                  />
                </svg>
              </button>
            </div>
          ))}
      </div>
      {loanDetails && loanDetails.amount && (
        <LoanEMICalculator
          loanDetails={loanDetails}
          handleDebtChange={handleDebtChange}
          hideLoanDetails={hideLoanDetails}
        ></LoanEMICalculator>
      )}
    </div>
  );
};

export default Debts;

// r74k6dDHO4UoW3Gi5QvdTLcpelUjoTnZJkrVsswYGrMkwxFn5s31lmnxBYpxhkzOMPpMU5TByVBQH/Xt2CVvutIGAssmUBDIqzpMNlyXIELMcIGnDGaLeg==
