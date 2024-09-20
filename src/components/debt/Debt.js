import React, { useState, useEffect, useCallback } from "react";
import { getDebts, addDebt } from "../../services/debtService";
import { getUsers } from "../../services/userService";
// import LoanEMICalculator from "./EMICalculator";

const Debts = () => {
  const userInfo = JSON.parse(localStorage.getItem("user"));
  const [debt, setDebt] = useState([]);
  const [users, setUsers] = useState([]);
  const [loanDetails, setLoanDetails] = useState({});
  const [debtForm, setDebtForm] = useState({
    amount: "",
    debt_type: "Personal",
    emi_amount: "",
    owed_to:  userInfo.id,
    startDate: "",
    endDate: "",
    emiDueDate: "",
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
      console.log(debtForm);
      const newTransaction = await addDebt(debtForm);
      setDebtForm({
        amount: "",
        debt_type: "Personal",
        emi_amount: "",
        owed_to: "",
        startDate: "",
        endDate: "",
        emiDueDate: "",
      });
    } catch (error) {}
  };

  return (
    <div className="flex min-h-full flex-col items-center justify-center px-6 py-12 lg:px-8">
      {debt &&
        debt.map((debt) => (
          <div key={debt._id} onClick={() => setLoanDetails(debt)}>
            {debt.amount}
          </div>
        ))}
      <div className="card auth-card sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Add Debt
          </h2>
        </div>
        <form
          onSubmit={handleSubmit}
          className="p-4  flex flex-col gap-4 items-center "
        >
          <div className="flex flex-col w-full gap-1">
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
          <div className="flex flex-col w-full gap-1">
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
          {debtForm.debt_type !== "Bank" && (
            <div className="flex flex-col w-full gap-1">
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
              </select>
            </div>
          )}
          <div className="flex flex-col w-full gap-1">
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
              <div className="flex flex-col w-full gap-1">
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
              <div className="flex flex-col w-full gap-1">
                <label
                  htmlFor="emiDueDate"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  EMI Date
                </label>
                <input
                  type="date"
                  id="emiDueDate"
                  name="emiDueDate"
                  value={debtForm.emiDueDate}
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
      {/* {loanDetails && loanDetails.amount && (
        <LoanEMICalculator loanDetails={loanDetails}></LoanEMICalculator>
      )} */}
    </div>
  );
};

export default Debts;
