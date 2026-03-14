import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../admin/AdminSidebar';

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen" style={{ background: '#808080' }}>
      <AdminSidebar />
      <main className="flex-1 overflow-auto" style={{ background: '#808080' }}>
        <Outlet />
      </main>
    </div>
  );
}