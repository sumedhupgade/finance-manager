import React, { useState, useEffect } from 'react';

const LoanEMICalculator = ({ loanDetails }) => {
  const [emi, setEmi] = useState(0);
  const [schedule, setSchedule] = useState([]);
  const loanAmount = 3000000;
  const interestRate = 6.8;
  const loanDurationYears = 30;
  const startDate = new Date('06-25-2021')

  const calculateEMI = () => {
    const n = loanDurationYears * 12; // Total number of months
    const r = interestRate / 12 / 100; // Monthly interest rate

    const emi = (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    setEmi(emi.toFixed(2));

    calculateEMISchedule(emi, loanAmount, r, n);
  };

  const calculateEMISchedule = (emi, principal, rate, months) => {
    let outstandingPrincipal = principal;
    const emiSchedule = [];
    const start = new Date(startDate);

    for (let i = 0; i < months; i++) {
      const interest = outstandingPrincipal * rate;
      const principalRepayment = emi - interest;
      outstandingPrincipal -= principalRepayment;

      const date = new Date(start);
      date.setMonth(date.getMonth() + i); // Increment month by month

      emiSchedule.push({
        month: date.toLocaleDateString(),
        emi: emi.toFixed(2),
        interest: interest.toFixed(2),
        principalRepayment: principalRepayment.toFixed(2),
        outstandingPrincipal: outstandingPrincipal > 0 ? outstandingPrincipal.toFixed(2) : '0.00', // Ensure no negative outstanding
      });
    }
    setSchedule(emiSchedule);
  };

  useEffect(() => {
    if (loanAmount && interestRate && loanDurationYears && startDate) {
      calculateEMI();
    }
  }, []);

  return (
    <div>
      <h2>EMI Calculator</h2>
      <p>Loan Amount: ₹{loanAmount}</p>
      <p>Interest Rate: {interestRate}%</p>
      <p>Loan Duration: {loanDurationYears} years</p>
      <p>Monthly EMI: ₹{emi}</p>
      <h3>Payment Schedule:</h3>
      <table>
        <thead>
          <tr>
            <th>Month</th>
            <th>EMI</th>
            <th>Interest</th>
            <th>Principal</th>
            <th>Outstanding Principal</th>
          </tr>
        </thead>
        <tbody>
          {schedule.map((item, index) => (
            <tr key={index}>
              <td>{item.month}</td>
              <td>₹{item.emi}</td>
              <td>₹{item.interest}</td>
              <td>₹{item.principalRepayment}</td>
              <td>₹{item.outstandingPrincipal}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LoanEMICalculator;
