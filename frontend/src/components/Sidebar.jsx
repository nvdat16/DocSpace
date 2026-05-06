import React from 'react';
import { Link } from 'react-router-dom';

const menu = [
  { label: 'Dashboard', to: '/' },
  { label: 'Documents', to: '/documents' },
];

export default function Sidebar() {
  return (
    <aside style={{ width: 240, padding: '1rem', borderRight: '1px solid #e5e7eb', background: '#fff' }}>
      <nav style={{ display: 'grid', gap: '0.5rem' }}>
        {menu.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            style={{
              textDecoration: 'none',
              color: '#0f172a',
              padding: '0.75rem 1rem',
              borderRadius: 10,
              background: '#f8fafc',
            }}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
