import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import ContainerPage from "../pages/ContainerPage";
import DashboardPage from "../pages/DashboardPage";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/containers" element={<ContainerPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}