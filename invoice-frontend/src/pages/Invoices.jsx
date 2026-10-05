import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getInvoices,deleteInvoice } from "../services/invoiceService";
function Invoices() {

  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();


  useEffect(() => {

    const fetchInvoices = async () => {

      try {

        const response = await getInvoices();

        setInvoices(response.data);

      } catch (error) {

        console.error("Invoice Error:", error);

        setError("Failed to load invoices");

      } finally {

        setLoading(false);

      }
    };

    fetchInvoices();

  }, []);

const handleDelete = async (invoiceId) => {

  const confirmed = window.confirm(
    "Are you sure you want to delete this invoice?"
  );

  if (!confirmed) {
    return;
  }

  try {

    await deleteInvoice(invoiceId);

    setInvoices((previousInvoices) =>
      previousInvoices.filter(
        (invoice) => invoice.id !== invoiceId
      )
    );

  } catch (error) {

    console.error("Delete Invoice Error:", error);

    setError("Failed to delete invoice");

  }
};
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">
          Loading invoices...
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


  return (
    <div>

      {/* Header */}

      <div className="flex items-center justify-between mb-6">

        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Invoices
          </h1>

          <p className="text-gray-500 mt-1">
            Manage your invoices
          </p>
        </div>

        <button
  onClick={() => navigate("/invoices/create")}
  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium"
>
  + Create Invoice
</button>

      </div>


      {/* Invoice Table */}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full text-left">

            <thead className="bg-gray-50 border-b border-gray-200">

              <tr>

                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  Invoice
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  Customer
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  Amount
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  Due Date
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  Status
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  Action
                </th>

              </tr>

            </thead>


            <tbody className="divide-y divide-gray-200">

              {invoices.length === 0 ? (

                <tr>

                  <td
                    colSpan="6"
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    No invoices found.
                  </td>

                </tr>

              ) : (

                invoices.map((invoice) => (

                  <tr
                    key={invoice.id}
                    className="hover:bg-gray-50"
                  >

                    <td className="px-6 py-4">

                      <p className="font-semibold text-gray-800">
                        {invoice.invoice_number}
                      </p>

                    </td>


                    <td className="px-6 py-4">

                      <p className="font-medium text-gray-800">
                        {invoice.customer_name}
                      </p>

                      <p className="text-sm text-gray-500">
                        {invoice.customer_email}
                      </p>

                    </td>


                    <td className="px-6 py-4 font-medium text-gray-800">

                      ₹{invoice.amount}

                    </td>


                    <td className="px-6 py-4 text-gray-600">

                      {invoice.due_date}

                    </td>


                    <td className="px-6 py-4">

                      <StatusBadge status={invoice.status} />

                    </td>


                    <td className="px-6 py-4">

  <div className="flex items-center gap-3">

    <button
      onClick={() => navigate(`/invoices/${invoice.id}/edit`)}
      className="text-blue-600 hover:text-blue-800 font-medium"
    >
      Edit
    </button>

    <button
      onClick={() => handleDelete(invoice.id)}
      className="text-red-600 hover:text-red-800 font-medium"
    >
      Delete
    </button>
    <button
  onClick={() => navigate(`/invoices/${invoice.id}`)}
  className="text-blue-600 hover:text-blue-800 font-medium"
>
  View
</button>

  </div>

</td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

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


export default Invoices;