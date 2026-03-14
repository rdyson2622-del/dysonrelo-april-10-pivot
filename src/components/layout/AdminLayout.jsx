import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../admin/AdminSidebar';

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen" style={{ background: '#A9A9A9' }}>
      <AdminSidebar />
      <main className="flex-1 overflow-auto" style={{ background: '#A9A9A9' }}>
        <Outlet />
      </main>
    </div>
  );
}