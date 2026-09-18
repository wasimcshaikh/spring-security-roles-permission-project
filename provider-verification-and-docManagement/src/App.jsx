import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import OtpVerificationPage from "./pages/OtpVerificationPage";
import Dashboard from "./pages/Dashboard";
import ProviderExportPage from "./pages/ProviderExportPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Unauthorized from "./pages/Unauthorized";
import Home from "./pages/Home";
import MyProfile from "./pages/MyProfile";
import ViewProviders from "./pages/ViewProviders";
import ProviderDocuments from "./pages/ProviderDocuments";
import RolesAndPermissions from "./pages/RolesAndPermissions";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/verify-otp" element={<OtpVerificationPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<MyProfile />} />
        <Route path="/providers" element={<ViewProviders />} />
        <Route path="/provider-documents" element={<ProviderDocuments />} />
        <Route path="/roles-permissions" element={<RolesAndPermissions />} />
        <Route
          path="/dashboard"
          element={<Dashboard />}  />
       
        {/* Admin */}{" "}
        <Route
          path="/provider-export"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              {" "}
              <ProviderExportPage />{" "}
            </ProtectedRoute>
          }
        />
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
