import React, { useState, useEffect, useCallback } from "react";
import { updateDebt } from "../../services/debtService";

const LoanEMICalculator = ({
  loanDetails,
  handleDebtChange,
  hideLoanDetails,
}) => {
  const [schedule, setSchedule] = useState([]);
  const [extraPaymentsForm, setExtraPaymentsForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    amount: "",
    description: "",
  });

  const calculateFixedRateEMISchedule = useCallback(() => {
    let outstanding = Number(loanDetails.amount);
    const schedule = [];

    // Keep EMI date-of-month consistent using UTC to avoid TZ shifts
    const start = new Date(loanDetails.startDate);
    const emiDay = start.getUTCDate();

    // Helper: key like "2025-08"
    const ymKey = (d) =>
      `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;

    // Aggregate extras per calendar month (sum if multiple)
    const extrasByMonth = loanDetails.extraPayments?.reduce((acc, p) => {
      const dt = new Date(p.date); // 'YYYY-MM-DD' → Date
      const key = ymKey(dt);
      acc[key] = (acc[key] || 0) + Number(p.amount || 0);
      return acc;
    }, {});

    for (let i = 0; i < loanDetails.tenure * 12 && outstanding > 0; i++) {
      // EMI date for this cycle (same day-of-month as start)
      const d = new Date(
        Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + i, emiDay)
      );
      const key = ymKey(d);

      // Interest for the month on opening balance
      const interest = outstanding * (loanDetails.interestRate / 100 / 12);

      // Regular principal portion (can't exceed outstanding)
      const regularPrincipal = Math.min(
        loanDetails.emi_amount - interest,
        outstanding
      );
      outstanding -= regularPrincipal;

      // Apply any extra payment scheduled in this calendar month
      const extraPlanned = extrasByMonth?.[key] || 0;
      const extraApplied = Math.min(extraPlanned, outstanding);
      outstanding -= extraApplied;

      schedule.push({
        month: d.toISOString().slice(0, 10), // YYYY-MM-DD (EMI date)
        emi: loanDetails.emi_amount,
        interest: interest.toFixed(2),
        principalRepayment: regularPrincipal.toFixed(2), // excluding extra
        extraPayment: extraApplied.toFixed(2),
        outstandingPrincipal: Math.max(outstanding, 0).toFixed(2),
      });
    }
    setSchedule(schedule);
  }, [loanDetails]);

  /**
   * Floating EMI Schedule calculator
   * Supports: extra payments + floating interest rate changes
   *
   * @param {Object} loanDetails
   *   amount: number (loan principal)
   *   startDate: string (ISO date)
   *   tenure: string|number (months)
   *   emi_amount: string|number (monthly EMI)
   *   interestRate: string|number (initial annual %)
   *   emiDate: string|number (preferred day of month)
   *   extraPayments: [{date: string, amount: number}]
   *   rateChanges: [{date: string, rate: number}]
   *
   * @returns {Array} schedule
   */
  const calculateFloatingEMISchedule = (loanDetails) => {
    let outstanding = Number(loanDetails.amount);
    const schedule = [];

    const start = new Date(loanDetails.startDate);
    const emiDay = Number(loanDetails.emiDate) || start.getUTCDate();
    const totalMonths = Number(loanDetails.tenure); // tenure is already months
    let emi = Number(loanDetails.emi_amount);
    let currentRate = Number(loanDetails.interestRate);

    // helper for year-month key
    const ymKey = (d) =>
      `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;

    // collect extra payments by month
    const extrasByMonth =
      loanDetails.extraPayments?.reduce((acc, p) => {
        const dt = new Date(p.date);
        const key = ymKey(dt);
        acc[key] = (acc[key] || 0) + Number(p.amount || 0);
        return acc;
      }, {}) || {};

    // collect rate changes by month
    const rateMap =
      loanDetails.rateChanges?.reduce((acc, r) => {
        const dt = new Date(r.date);
        const key = ymKey(dt);
        acc[key] = Number(r.rate);
        return acc;
      }, {}) || {};

    for (let i = 0; i < totalMonths && outstanding > 0; i++) {
      const d = new Date(
        Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + i, emiDay)
      );
      const key = ymKey(d);

      // 🔄 update rate if changed this month
      if (rateMap[key]) {
        currentRate = rateMap[key];

        // Option A: keep EMI constant (tenure adjusts) ✅ default
        // Option B: keep tenure fixed, recalc EMI → uncomment below
        /*
      const monthsRemaining = totalMonths - i;
      const monthlyRate = currentRate / 100 / 12;
      emi =
        (outstanding * monthlyRate * Math.pow(1 + monthlyRate, monthsRemaining)) /
        (Math.pow(1 + monthlyRate, monthsRemaining) - 1);
      */
      }

      const monthlyRate = currentRate / 100 / 12;
      const interest = outstanding * monthlyRate;

      const regularPrincipal = Math.min(emi - interest, outstanding);
      outstanding -= regularPrincipal;

      // apply extra payments if any
      const extraPlanned = extrasByMonth[key] || 0;
      const extraApplied = Math.min(extraPlanned, outstanding);
      outstanding -= extraApplied;

      schedule.push({
        month: d.toISOString().slice(0, 10), // YYYY-MM-DD
        emi: emi.toFixed(2),
        interest: interest.toFixed(2),
        principalRepayment: regularPrincipal.toFixed(2),
        extraPayment: extraApplied.toFixed(2),
        outstandingPrincipal: Math.max(outstanding, 0).toFixed(2),
        interestRate: currentRate.toFixed(2),
      });
    }

    return schedule;
  };

  useEffect(() => {
    if (loanDetails.rateChanges) {
      const newSchedule = calculateFloatingEMISchedule(loanDetails);
      setSchedule(newSchedule);
    } else {
      calculateFixedRateEMISchedule(loanDetails);
    }
  }, [calculateFixedRateEMISchedule, loanDetails]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExtraPaymentsForm({
      ...extraPaymentsForm,
      [name]: value,
    });
  };

  const submitExtras = (e) => {
    e.preventDefault(); // prevent page reload
    schedule.find((s) => s.month === extraPaymentsForm.date);
    const updatedExtras = [
      ...(loanDetails?.extraPayments || []),
      extraPaymentsForm,
    ];
    const extraDate = new Date(extraPaymentsForm.date)
      .toISOString()
      .slice(0, 10);

    const extraYM = extraDate.slice(0, 7); // "YYYY-MM"
    const matchedSchedule = schedule.find((s) => s.month.slice(0, 7) === extraYM);
    const outstanding = matchedSchedule ? (matchedSchedule.outstandingPrincipal - Number(extraPaymentsForm.amount)) : 0;
    const req =
      loanDetails.debt_type !== "Personal"
        ? {
            id: loanDetails._id,
            extraPayments: updatedExtras,
            outstanding_amount: outstanding,
          }
        : {
            id: loanDetails._id,
            extraPayments: updatedExtras,
            amount: (
              Number(loanDetails.amount) + Number(extraPaymentsForm.amount)
            ).toFixed(2),
          };
          console.log("REQ", req);
          
    updateDebt(req)
      .then((res) => {
        console.log("Extra payment added:", res);
        handleDebtChange(res);
        setExtraPaymentsForm({ date: new Date().toISOString().slice(0, 10), amount: "", description: "" });
      })
      .catch((err) => {
        console.error("Error adding extra payment:", err);
      });
  };

  return (
    <div className="w-full p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl shadow-lg relative">
      <button
        type="button"
        aria-label="Close"
        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-xl focus:outline-none"
        style={{
          position: "absolute",
          top: "1rem",
          right: "1rem",
          background: "none",
          border: "none",
        }}
        onClick={() => hideLoanDetails()}
      >
        &#10005;
      </button>
      <h2 className="text-2xl font-bold mb-4 text-blue-700">Loan Details</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-gray-600">Loan Amount:</p>
          <p className="font-semibold text-lg text-gray-800">
            ₹{loanDetails.amount}
          </p>
        </div>
        {loanDetails.debt_type !== "Personal" && (
          <>
          <div>
          <p className="text-gray-600">Outstanding Loan Amount:</p>
          <p className="font-semibold text-lg text-gray-800">
            ₹{loanDetails.outstanding_amount}
          </p>
        </div>
            <div>
              <p className="text-gray-600">Interest Rate:</p>
              <p className="font-semibold text-lg text-gray-800">
                {loanDetails.interestRate}%
              </p>
            </div>
            <div>
              <p className="text-gray-600">Loan Duration:</p>
              <p className="font-semibold text-lg text-gray-800">
                {loanDetails.tenure / 12} years
              </p>
            </div>
            <div>
              <p className="text-gray-600">Monthly EMI:</p>
              <p className="font-semibold text-lg text-green-700">
                ₹{loanDetails.emi_amount}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Expected End Date:</p>
              <p className="font-semibold text-lg text-green-700">
                {schedule[schedule.length - 1]?.month}
              </p>
            </div>
          </>
        )}
      </div>
      <form
        onSubmit={submitExtras}
        className="mb-6 grid grid-cols-1 sm:grid-cols-4 gap-2"
      >
        <div>
          <input
            type="number"
            placeholder="Amount"
            name="amount"
            value={extraPaymentsForm.amount}
            onChange={handleChange}
            required
            className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
        <div>
          <input
            type="date"
            name="date"
            value={extraPaymentsForm.date}
            onChange={handleChange}
            required
            className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
        {loanDetails.debt_type === "Personal" && (
          <div>
            <input
              type="text"
              name="description"
              value={extraPaymentsForm.description}
              placeholder="Description"
              onChange={handleChange}
              required
              className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        )}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 h-full rounded hover:bg-blue-600 mt-2 sm:mt-0"
        >
          Add Transaction
        </button>
      </form>
      <h3 className="text-xl font-semibold mb-2 text-blue-600">
        {loanDetails.debt_type !== "Personal"
          ? "Payment Schedule"
          : "Transaction History"}
      </h3>
      <div className="overflow-x-auto">
        {loanDetails.debt_type !== "Personal" && (
          <table className="min-w-full bg-white border border-gray-200 rounded-lg text-xs sm:text-sm">
            <thead>
              <tr className="bg-blue-50">
                <th className="py-2 px-3 whitespace-nowrap text-left font-medium text-gray-700 ">
                  Month
                </th>
                <th className="py-2 px-3 whitespace-nowrap text-left font-medium text-gray-700 ">
                  EMI
                </th>
                <th className="py-2 px-3 whitespace-nowrap text-left font-medium text-gray-700 ">
                  Interest
                </th>
                <th className="py-2 px-3 whitespace-nowrap text-left font-medium text-gray-700 ">
                  Principal
                </th>
                <th className="py-2 px-3 whitespace-nowrap text-left font-medium text-gray-700 ">
                  Extra Payment
                </th>
                <th className="py-2 px-3 whitespace-nowrap text-left font-medium text-gray-700 ">
                  Outstanding
                </th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((item, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="py-2 px-3 whitespace-nowrap">{item.month}</td>
                  <td className="py-2 px-3 whitespace-nowrap text-blue-700 font-semibold">
                    ₹{item.emi}
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap text-red-600">
                    ₹{item.interest}
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap text-green-700">
                    ₹{item.principalRepayment}
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap text-green-700">
                    ₹{item.extraPayment}
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap text-gray-800">
                    ₹{item.outstandingPrincipal}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {loanDetails.debt_type === "Personal" && (
          <table className="min-w-full bg-white border border-gray-200 rounded-lg text-xs sm:text-sm">
            <thead>
              <tr className="bg-blue-50">
                <th className="py-2 px-3 whitespace-nowrap text-left font-medium text-gray-700 ">
                  Date
                </th>
                <th className="py-2 px-3 whitespace-nowrap text-left font-medium text-gray-700 ">
                  Amount
                </th>
                <th className="py-2 px-3 whitespace-nowrap text-left font-medium text-gray-700 ">
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              {loanDetails.extraPayments.length > 0 &&
                loanDetails.extraPayments.map((payment, index) => (
                  <tr className="bg-white" key={index}>
                    <td className="py-2 px-3 whitespace-nowrap">
                      {payment.date}
                    </td>
                    <td className="py-2 px-3 whitespace-nowrap">
                      ₹{payment.amount}
                    </td>
                    <td className="py-2 px-3 whitespace-nowrap">
                      {payment.description}
                    </td>
                  </tr>
                ))}
              {(!loanDetails.extraPayments ||
                loanDetails.extraPayments.length === 0) && (
                <tr>
                  <td
                    colSpan="3"
                    className="py-4 text-center text-gray-500 whitespace-nowrap"
                  >
                    No Payments Made Yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default LoanEMICalculator;
