// src/pages/makepayment/MakePayment.tsx
import React, { useState } from 'react';
import { fetchSheetData, updateSheetData } from '../../api/googleSheetsApi';
import './makePayment.css'; // Import the CSS file for styling

const MakePayment: React.FC = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');

  const handlePayment = async () => {
    try {
      // Fetch the current data from the sheet
      const values = await fetchSheetData();
      const formattedData = values.map((row: any) => ({
        last_4_digits: row.last_4_digits,
        paid: row.paid || '0', // Default to '0' if empty
      }));

      // Find the row with the matching card number
      const rowIndex = formattedData.findIndex((row: { last_4_digits: string; paid: string }) => row.last_4_digits === cardNumber);
      if (rowIndex === -1) {
        setMessage('Card number not found.');
        return;
      }

      // Update the paid amount
      const currentPaid = parseFloat(formattedData[rowIndex].paid);
      const newPaid = currentPaid + parseFloat(amount);
      const updatedData = { paid: newPaid.toString() };

      // Write the updated data back to the sheet
      await updateSheetData(formattedData[rowIndex].last_4_digits, updatedData);

      setMessage('Payment updated successfully.');
      setCardNumber('');
      setAmount('');
    } catch (error) {
      console.error('Error updating payment:', error);
      setMessage('Error updating payment.');
    }
  };

  return (
    <div className="make-payment">
      <h2>Make a Payment</h2>
      <input
        type="text"
        placeholder="Last 4 Digits of Card"
        value={cardNumber}
        onChange={(e) => setCardNumber(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={handlePayment}>Submit Payment</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default MakePayment;