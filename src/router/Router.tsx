import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import ContainerPage from "../pages/ContainerPage";
import DashboardPage from "../pages/DashboardPage";
import LoginPage from "../pages/LoginPage";

import PrivateRoute from "./PrivateRoute";
import UsersPage from "../pages/UsersPage";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          } />
          <Route path="/containers" element={
            <PrivateRoute>
              <ContainerPage />
            </PrivateRoute>
          } />
          <Route path="/users" element={
            <PrivateRoute>
              <UsersPage />
            </PrivateRoute>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}