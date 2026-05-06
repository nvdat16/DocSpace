import React from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

export default function MainLayout({ children }) {
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Header />
      <div style={{ display: 'flex', minHeight: 'calc(100vh - 65px)' }}>
        <Sidebar />
        <main style={{ flex: 1, padding: '1.5rem' }}>{children}</main>
      </div>
    </div>
  );
}
