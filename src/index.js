
import React, { Fragment } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.scss";

import AdminLayout from "layouts/Admin.js";
import AuthLayout from "layouts/Auth.js";
import HomeLayout from "layouts/Home";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Fragment>
    <AuthProvider>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <BrowserRouter>
        <Routes>
          <Route path="/admin/*" element={<AdminLayout />} />
          <Route path="/auth/*" element={<AuthLayout />} />
          <Route path="*" element={<Navigate to="/admin/index" replace />} />
          <Route path="/" element={<HomeLayout />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </Fragment>
);
