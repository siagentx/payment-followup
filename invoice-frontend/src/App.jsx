import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";
import { Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Invoices from "./pages/Invoices";
import Login from "./pages/Login";
import CreateInvoice from "./pages/CreateInvoice";
import EditInvoice from "./pages/EditInvoice";
import InvoiceDetails from "./pages/InvoiceDetails";
import PublicInvoice from "./pages/PublicInvoice";
import PaymentSuccess from "./pages/PaymentSuccess";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"  element={<Navigate to="/dashboard" replace />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/invoice/:publicToken" element={<PublicInvoice />}/>
        <Route path="/payment-success" element={<PaymentSuccess />}/>
        <Route element={<ProtectedRoute />}>
           <Route path="/dashboard" element={
              <AppLayout>
                <Dashboard />
              </AppLayout>
            }
          />

          <Route
            path="/invoices"
            element={
              <AppLayout>
                <Invoices />
              </AppLayout>
            }
          />

          <Route
            path="/invoices/create"
            element={
              <AppLayout>
                <CreateInvoice />
              </AppLayout>
            }
          />

          <Route
            path="/invoices/:invoiceId"
            element={
              <AppLayout>
                <InvoiceDetails />
              </AppLayout>
            }
          />

          <Route
            path="/invoices/:invoiceId/edit"
            element={
              <AppLayout>
                <EditInvoice />
              </AppLayout>
            }
          />

        </Route>

      </Routes>

    </BrowserRouter>
  );
}


function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">

      <Navbar />

      <div className="flex">

        <Sidebar />

        <main className="flex-1 p-6">
          {children}
        </main>

      </div>

    </div>
  );
}


export default App;