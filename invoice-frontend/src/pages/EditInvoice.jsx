import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getInvoice,
  updateInvoice,
} from "../services/invoiceService";

function EditInvoice() {

  const { invoiceId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: "",
    amount: "",
    due_date: "",
    description: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");


  // Get existing invoice

  useEffect(() => {

    const fetchInvoice = async () => {

      try {

        const response = await getInvoice(invoiceId);

        const invoice = response.data;

        setFormData({
          customer_name: invoice.customer_name,
          customer_email: invoice.customer_email,
          amount: invoice.amount,
          due_date: invoice.due_date,
          description: invoice.description || "",
        });

      } catch (error) {

        console.error("Invoice Error:", error);

        setError("Failed to load invoice");

      } finally {

        setLoading(false);

      }
    };

    fetchInvoice();

  }, [invoiceId]);


  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

  };


  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");
    setSaving(true);

    try {

      await updateInvoice(invoiceId, {
        customer_name: formData.customer_name,
        customer_email: formData.customer_email,
        amount: formData.amount,
        due_date: formData.due_date,
        description: formData.description,
      });

      navigate("/invoices");

    } catch (error) {

      console.error("Update Invoice Error:", error);

      if (error.response?.data?.detail) {
        setError(error.response.data.detail);
      } else {
        setError("Failed to update invoice");
      }

    } finally {

      setSaving(false);

    }
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">
          Loading invoice...
        </p>
      </div>
    );
  }


  return (
    <div className="max-w-3xl mx-auto">

      <div className="mb-6">

        <h1 className="text-2xl font-bold text-gray-800">
          Edit Invoice
        </h1>

        <p className="text-gray-500 mt-1">
          Update invoice information
        </p>

      </div>


      {error && (
        <div className="mb-5 p-4 rounded-lg bg-red-100 text-red-700">
          {error}
        </div>
      )}


      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">


          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Customer Name
            </label>

            <input
              type="text"
              name="customer_name"
              value={formData.customer_name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

          </div>


          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Customer Email
            </label>

            <input
              type="email"
              name="customer_email"
              value={formData.customer_email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

          </div>


          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount
            </label>

            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

          </div>


          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Due Date
            </label>

            <input
              type="date"
              name="due_date"
              value={formData.due_date}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

          </div>

        </div>


        <div className="mt-5">

          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

        </div>


        <div className="flex justify-end gap-3 mt-6">

          <button
            type="button"
            onClick={() => navigate("/invoices")}
            className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>

        </div>

      </form>

    </div>
  );
}

export default EditInvoice;