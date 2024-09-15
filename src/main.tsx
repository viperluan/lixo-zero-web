import '@fortawesome/fontawesome-free/css/all.min.css';

import '~assets/plugins/nucleo/css/nucleo.css';
import '~assets/scss/argon-dashboard-react.scss';
import 'bootstrap/dist/css/bootstrap.min.css';

import 'react-toastify/dist/ReactToastify.css';
import './styles.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import AdminLayout from '~layouts/Admin';
import AuthLayout from '~layouts/Auth';
import HomeLayout from '~layouts/Home';

import { ToastContainer } from 'react-toastify';
import { AuthProvider } from '~context/AuthContext';
import { CookiesProvider } from 'react-cookie';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CookiesProvider defaultSetOptions={{ path: '/' }}>
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
            <Route path="/*" element={<HomeLayout />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </CookiesProvider>
  </StrictMode>
);
