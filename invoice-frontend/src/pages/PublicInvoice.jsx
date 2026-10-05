import { useEffect, useState } from "react";
import api from "../services/api";
import { createPublicPayment } from "../services/paymentService";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../components/Loading";
function PublicInvoice() {
  const { publicToken } = useParams();

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("UPI");
const [paymentLoading, setPaymentLoading] = useState(false);
const [paymentError, setPaymentError] = useState("");
const navigate = useNavigate();
  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await api.get(
          `/invoice/${publicToken}`
        );

        setInvoice(response.data);
      } catch (error) {
        console.error("Public Invoice Error:", error);

        if (error.response?.status === 404) {
          setError("Invoice not found");
        } else {
          setError("Failed to load invoice");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [publicToken]);
const handlePayment = async () => {
  setPaymentError("");
  setPaymentLoading(true);

  try {
    const response = await createPublicPayment(
      publicToken,
      {
        amount: invoice.amount,
        payment_method: paymentMethod,
      }
    );

    console.log("Payment Success:", response.data);

    navigate("/payment-success", {
      state: {
        payment: response.data,
      },
    });

  } catch (error) {
    console.error("Payment Error:", error);

    if (error.response?.data?.detail) {
      setPaymentError(error.response.data.detail);
    } else {
      setPaymentError("Payment failed");
    }

  } finally {
    setPaymentLoading(false);
  }
};
  if (loading) {
  return (
    <Loading message="Loading invoice..." />
  );
}

  if (error) {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center max-w-md w-full">

        <h1 className="text-2xl font-bold text-gray-800">
          Invoice Unavailable
        </h1>

        <p className="text-gray-500 mt-3">
          {error}
        </p>

      </div>
    </div>
  );
}

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">

      <div className="max-w-3xl mx-auto">

        {/* Header */}

        <div className="text-center mb-8">

          <h1 className="text-3xl font-bold text-gray-800">
            Invoice
          </h1>

          <p className="text-gray-500 mt-2">
            {invoice.invoice_number}
          </p>

        </div>


        {/* Invoice Card */}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

          {/* Top Section */}

          <div className="p-6 border-b border-gray-200 flex items-center justify-between">

            <div>

              <p className="text-sm text-gray-500">
                Invoice Number
              </p>

              <h2 className="text-xl font-bold text-gray-800 mt-1">
                {invoice.invoice_number}
              </h2>

            </div>

            <StatusBadge status={invoice.status} />

          </div>


          {/* Customer */}

          <div className="p-6">

            <h3 className="text-sm font-semibold text-gray-500 uppercase">
              Bill To
            </h3>

            <div className="mt-3">

              <p className="text-lg font-semibold text-gray-800">
                {invoice.customer_name}
              </p>

              <p className="text-gray-500 mt-1">
                {invoice.customer_email}
              </p>

            </div>

          </div>


          {/* Amount */}

          <div className="px-6 pb-6">

            <div className="bg-gray-50 rounded-xl p-5">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm text-gray-500">
                    Amount Due
                  </p>

                  <p className="text-3xl font-bold text-gray-800 mt-1">
                    ₹{invoice.amount}
                  </p>
                </div>

                <div className="text-right">

                  <p className="text-sm text-gray-500">
                    Due Date
                  </p>

                  <p className="font-semibold text-gray-800 mt-1">
                    {invoice.due_date}
                  </p>

                </div>

              </div>

            </div>

          </div>


          {/* Description */}

          <div className="px-6 pb-6">

            <h3 className="text-sm font-semibold text-gray-500 uppercase">
              Description
            </h3>

            <div className="mt-3 bg-gray-50 rounded-lg p-4">

              <p className="text-gray-700">
                {invoice.description ||
                  "No description provided"}
              </p>

            </div>

          </div>


          {/* Payment */}

          <div className="p-6 border-t border-gray-200">

            {invoice.status === "paid" ? (

              <div className="bg-green-50 rounded-xl p-5">

                <p className="text-green-700 font-semibold text-lg">
                  ✓ Invoice Paid
                </p>

                {invoice.paid_at && (
                  <p className="text-green-600 text-sm mt-1">
                    Paid on{" "}
                    {new Date(
                      invoice.paid_at
                    ).toLocaleDateString()}
                  </p>
                )}

              </div>

            ) : (

              <div>

             <div>

  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Payment Method
    </label>

    <select
      value={paymentMethod}
      onChange={(e) => setPaymentMethod(e.target.value)}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="UPI">UPI</option>
      <option value="Card">Card</option>
      <option value="Bank Transfer">
        Bank Transfer
      </option>
    </select>
  </div>

  {paymentError && (
    <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700 text-sm">
      {paymentError}
    </div>
  )}

  <button
    onClick={handlePayment}
    disabled={paymentLoading}
    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
  >
    {paymentLoading
      ? "Processing Payment..."
      : `Pay ₹${invoice.amount}`}
  </button>

</div>

              </div>

            )}

          </div>

        </div>


        {/* Footer */}

        <p className="text-center text-sm text-gray-400 mt-6">
          Invoice Reminder System
        </p>

      </div>

    </div>
  );
}


function StatusBadge({ status }) {

  const styles = {
    pending: "bg-blue-100 text-blue-700",
    due_today: "bg-yellow-100 text-yellow-700",
    overdue: "bg-red-100 text-red-700",
    paid: "bg-green-100 text-green-700",
  };

  return (
    <span
      className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
        styles[status] ||
        "bg-gray-100 text-gray-700"
      }`}
    >
      {status.replace("_", " ")}
    </span>
  );
}


export default PublicInvoice;