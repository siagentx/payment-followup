import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getInvoice } from "../services/invoiceService";
import { createPayment } from "../services/paymentService";
function InvoiceDetails() {
  const { invoiceId } = useParams();
  const navigate = useNavigate();

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("UPI");
const [paymentLoading, setPaymentLoading] = useState(false);
const [paymentError, setPaymentError] = useState("");
const handlePayment = async () => {
  setPaymentError("");
  setPaymentLoading(true);

  try {
    await createPayment(invoiceId, {
      amount: invoice.amount,
      payment_method: paymentMethod,
    });

    setInvoice((previousInvoice) => ({
      ...previousInvoice,
      status: "paid",
      paid_at: new Date().toISOString(),
    }));

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
  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await getInvoice(invoiceId);

        setInvoice(response.data);
      } catch (error) {
        console.error("Invoice Details Error:", error);
        setError("Failed to load invoice");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [invoiceId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">
          Loading invoice...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded-lg">
        {error}
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="bg-yellow-100 text-yellow-700 p-4 rounded-lg">
        Invoice not found
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">

        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Invoice Details
          </h1>

          <p className="text-gray-500 mt-1">
            {invoice.invoice_number}
          </p>
        </div>

        <button
          onClick={() => navigate("/invoices")}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          ← Back
        </button>

      </div>

      {/* Main Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">

        {/* Invoice Header */}
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

        {/* Customer + Invoice Information */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Customer */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase">
              Customer
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

          {/* Invoice Information */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase">
              Invoice Information
            </h3>

            <div className="mt-3 space-y-2">

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Amount
                </span>

                <span className="font-semibold text-gray-800">
                  ₹{invoice.amount}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Due Date
                </span>

                <span className="font-medium text-gray-800">
                  {invoice.due_date}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Created
                </span>

                <span className="font-medium text-gray-800">
                  {new Date(invoice.created_at).toLocaleDateString()}
                </span>
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
              {invoice.description || "No description provided"}
            </p>
          </div>

        </div>

      {/* Payment Information */}

<div className="px-6 pb-6">

  <h3 className="text-sm font-semibold text-gray-500 uppercase">
    Payment
  </h3>

  <div className="mt-3 bg-gray-50 rounded-lg p-5">

    {invoice.status === "paid" ? (

      <div>
        <p className="text-green-600 font-semibold text-lg">
          Payment Completed
        </p>

        <p className="text-gray-700 mt-2">
          Amount Paid: ₹{invoice.amount}
        </p>

        {invoice.paid_at && (
          <p className="text-gray-500 text-sm mt-1">
            Paid on{" "}
            {new Date(invoice.paid_at).toLocaleDateString()}
          </p>
        )}
      </div>

    ) : (

      <div>

        <div className="mb-4">
          <p className="text-sm text-gray-500">
            Amount to Pay
          </p>

          <p className="text-2xl font-bold text-gray-800 mt-1">
            ₹{invoice.amount}
          </p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payment Method
          </label>

          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full md:w-64 px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="UPI">UPI</option>
            <option value="Bank Transfer">
              Bank Transfer
            </option>
            <option value="Cash">
              Cash
            </option>
            <option value="Card">
              Card
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
          className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium disabled:opacity-50"
        >
          {paymentLoading
            ? "Processing..."
            : "Mark as Paid"}
        </button>

      </div>

    )}

  </div>

</div>

        {/* Actions */}
        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">

          <button
            onClick={() =>
              navigate(`/invoices/${invoice.id}/edit`)
            }
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
          >
            Edit Invoice
          </button>

        </div>

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
        styles[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status.replace("_", " ")}
    </span>
  );
}


export default InvoiceDetails;