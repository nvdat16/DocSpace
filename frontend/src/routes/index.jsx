import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Documents from '../pages/Documents';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import RequireAuth from '../components/RequireAuth';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/home',
    element: <RequireAuth><Home /></RequireAuth>,
  },
  {
    path: '/dashboard',
    element: <RequireAuth><Dashboard /></RequireAuth>,
  },
  {
    path: '/documents',
    element: <RequireAuth><Documents /></RequireAuth>,
  },
]);
