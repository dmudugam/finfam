// src/App.tsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { useTable, Column } from "react-table";
import './App.css'; // Import the CSS file
import Login from './login/login'; // Import the Login component
import NavBar from './navbar/navbar'; // Import the NavBar component
import ProtectedRoute from './login/ProtectedRoute'; // Import the ProtectedRoute component
import { fetchSheetData } from './api/googleSheetsApi';

interface Data {
  priority: string;
  person: string;
  lender: string;
  description: string;
  type: string;
  last_4_digits: string;
  card_type: string;
  amount: string;
  paid: string;
  due_date: string;
  minimum_payment: string;
  notes: string;
}

const AppContent: React.FC = () => {
  const [data, setData] = useState<Data[]>([]);

  useEffect(() => {
    const spreadsheetId = '1ut1nDZrXfwXfmSrg_LB16QyZBu-kL24ost1x8vQVJyI';
    const range = 'Sheet1!A2:L'; // Adjust the range according to your sheet

    fetchSheetData(spreadsheetId, range).then((values) => {
      const formattedData: Data[] = (values as string[][]).map((row: string[], index: number, array: string[][]) => {
        const isLastRow = index === array.length - 1;
        return {
          priority: isLastRow ? '' : row[0],
          person: isLastRow ? '' : row[1],
          lender: isLastRow ? '' : row[2],
          description: isLastRow ? '' : row[3],
          type: isLastRow ? '' : row[4],
          last_4_digits: isLastRow ? '' : row[5],
          card_type: isLastRow ? '' : row[6],
          amount: row[7] || '0', // Default to '0' if empty
          paid: row[8] || '0', // Default to '0' if empty
          due_date: isLastRow ? '' : row[9],
          minimum_payment: row[10] || '0', // Default to '0' if empty
          notes: isLastRow ? '' : row[11],
        };
      });
      setData(formattedData);
    }).catch((error: any) => {
      console.error('Error fetching data from Google Sheets:', error);
    });
  }, []);

  const columns: Column<Data>[] = React.useMemo(
    () => [
      {
        Header: 'Priority',
        accessor: 'priority',
      },
      {
        Header: 'Person',
        accessor: 'person',
      },
      {
        Header: 'Lender',
        accessor: 'lender',
      },
      {
        Header: 'Description',
        accessor: 'description',
      },
      {
        Header: 'Type',
        accessor: 'type',
      },
      {
        Header: 'Last 4 Digits',
        accessor: 'last_4_digits',
      },
      {
        Header: 'Card Type',
        accessor: 'card_type',
      },
      {
        Header: 'Amount',
        accessor: 'amount',
      },
      {
        Header: 'Paid',
        accessor: 'paid',
      },
      {
        Header: 'Due Date',
        accessor: 'due_date',
      },
      {
        Header: 'Minimum Payment',
        accessor: 'minimum_payment',
      },
      {
        Header: 'Notes',
        accessor: 'notes',
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data });

  return (
    <div>
      <table id="table-to-pdf" {...getTableProps()} className="styled-table">
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, index) => {
            prepareRow(row);
            const isLastRow = index === rows.length - 1;
            return (
              <tr {...row.getRowProps()} style={isLastRow ? { fontWeight: 'bold', color: 'red' } : {}}>
                {row.cells.map((cell, cellIndex) => {
                  if (isLastRow && cellIndex === 0) {
                    return (
                      <td {...cell.getCellProps()} colSpan={7} style={{ fontWeight: 'bold', color: 'red' }}>
                        Total
                      </td>
                    );
                  }
                  if (isLastRow && cellIndex < 7) {
                    return null;
                  }
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const App: React.FC = () => {
  const location = useLocation();

  return (
    <>
      {location.pathname !== '/login' && <NavBar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/app" element={<ProtectedRoute element={<AppContent />} />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </>
  );
};

const AppWrapper: React.FC = () => {
  return (
    <Router>
      <App />
    </Router>
  );
};

export default AppWrapper;