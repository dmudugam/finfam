// src/App.tsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { useTable, Column, CellProps } from "react-table";
import './App.css'; // Import the CSS file
import Login from './pages/login/login'; // Import the Login component
import NavBar from './pages/navbar/navbar'; // Import the NavBar component
import ProtectedRoute from './pages/login/ProtectedRoute'; // Import the ProtectedRoute component
import MakePayment from './pages/makepayment/makePayment'; // Import the MakePayment component
import { fetchSheetData } from './api/googleSheetsApi';
import Footer from './components/Footer/footer'; // Import the Footer component

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
    fetchSheetData().then((values) => {
      const formattedData: Data[] = (values as any[]).map((row: any, index: number, array: any[]) => {
        const isLastRow = index === array.length - 1;
        return {
          priority: isLastRow ? '' : row.priority,
          person: isLastRow ? '' : row.person,
          lender: isLastRow ? '' : row.lender,
          description: isLastRow ? '' : row.description,
          type: isLastRow ? '' : row.type,
          last_4_digits: isLastRow ? '' : row.last_4_digits,
          card_type: isLastRow ? '' : row.card_type,
          amount: row.amount || '0', // Default to '0' if empty
          paid: row.paid || '0', // Default to '0' if empty
          due_date: isLastRow ? '' : row.due_date,
          minimum_payment: row.minimum_payment || '0', // Default to '0' if empty
          notes: isLastRow ? '' : row.notes,
        };
      });
      setData(formattedData);
    }).catch((error: any) => {
      console.error('Error fetching data from SheetDB:', error);
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
        Cell: ({ row, value }: CellProps<Data, string>) => {
          const rowIndex = row.index;
          const isFirstRow = rowIndex === 0;
          return <span>{isFirstRow ? value : `$${value}`}</span>;
        },
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
    // eslint-disable-next-line
    [data]
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
        <Route path="/make-payment" element={<ProtectedRoute element={<MakePayment />} />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
      <Footer /> {/* Add the Footer component */}
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