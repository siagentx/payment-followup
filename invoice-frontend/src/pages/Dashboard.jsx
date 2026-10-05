import { useEffect, useState } from "react";
import { getDashboard } from "../services/dashboardService";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
function Dashboard() {

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {

    const fetchDashboard = async () => {

      try {

        const response = await getDashboard();

        setDashboard(response.data);

      } catch (error) {

        console.error("Dashboard Error:", error);

        setError("Failed to load dashboard");

      } finally {

        setLoading(false);

      }
    };

    fetchDashboard();

  }, []);


if (loading) {
  return (
    <Loading message="Loading dashboard..." />
  );
}


  if (error) {
    return (
      <ErrorMessage message={error} />
    );
  }


  return (
    <div>

      {/* Header */}

      <div className="mb-6">

        <h1 className="text-2xl font-bold text-gray-800">
          Dashboard
        </h1>

        <p className="text-gray-500 mt-1">
          Overview of your invoices and payments
        </p>

      </div>


      {/* Summary Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">


        {/* Total Invoices */}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">

          <p className="text-sm text-gray-500">
            Total Invoices
          </p>

          <h2 className="text-3xl font-bold text-gray-800 mt-2">
            {dashboard.total_invoices}
          </h2>

        </div>


        {/* Total Invoiced */}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">

          <p className="text-sm text-gray-500">
            Total Invoiced
          </p>

          <h2 className="text-3xl font-bold text-gray-800 mt-2">
            ₹{dashboard.total_invoiced}
          </h2>

        </div>


        {/* Outstanding */}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">

          <p className="text-sm text-gray-500">
            Outstanding
          </p>

          <h2 className="text-3xl font-bold text-orange-600 mt-2">
            ₹{dashboard.total_outstanding}
          </h2>

        </div>


        {/* Collected */}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">

          <p className="text-sm text-gray-500">
            Collected
          </p>

          <h2 className="text-3xl font-bold text-green-600 mt-2">
            ₹{dashboard.total_collected}
          </h2>

        </div>

      </div>


      {/* Status Cards */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">


        {/* Due Today */}

        <div className="bg-white rounded-xl border border-gray-200 p-5">

          <p className="text-gray-500 text-sm">
            Due Today
          </p>

          <h2 className="text-2xl font-bold text-blue-600 mt-2">
            {dashboard.due_today}
          </h2>

        </div>


        {/* Overdue */}

        <div className="bg-white rounded-xl border border-gray-200 p-5">

          <p className="text-gray-500 text-sm">
            Overdue
          </p>

          <h2 className="text-2xl font-bold text-red-600 mt-2">
            {dashboard.overdue}
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            ₹{dashboard.overdue_amount}
          </p>

        </div>


        {/* Paid */}

        <div className="bg-white rounded-xl border border-gray-200 p-5">

          <p className="text-gray-500 text-sm">
            Paid
          </p>

          <h2 className="text-2xl font-bold text-green-600 mt-2">
            {dashboard.paid}
          </h2>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;