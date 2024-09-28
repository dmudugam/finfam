// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { useTable, Column } from "react-table";
import './App.css'; // Import the CSS file
import Login from './login/login'; // Import the Login component
import NavBar from './navbar/navbar'; // Import the NavBar component
import ProtectedRoute from './login/ProtectedRoute'; // Import the ProtectedRoute component

interface Data {
  name: string;
  description: string;
  type: string; // Added type property
  last4: string;
  card: string;
  amount: string;
  notes: string;
}

const AppContent: React.FC = () => {
  const data: Data[] = React.useMemo(
      () => [
        {
          name: 'John Doe',
          description: 'Purchase',
          type: 'Debit',
          last4: '1234',
          card: 'Visa',
          amount: '$100.00',
          notes: 'N/A',
        },
        // More rows...
      ],
      []
  );

  const columns: Column<Data>[] = React.useMemo(
      () => [
        {
          Header: 'Name',
          accessor: 'name', // accessor is the "key" in the data
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
          accessor: 'last4',
        },
        {
          Header: 'Card',
          accessor: 'card',
        },
        {
          Header: 'Amount',
          accessor: 'amount',
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
        {rows.map(row => {
          prepareRow(row);
          return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                ))}
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