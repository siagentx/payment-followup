import { useLocation, useNavigate } from "react-router-dom";

function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  const payment = location.state?.payment;

  if (!payment) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center max-w-md w-full">

          <h1 className="text-2xl font-bold text-gray-800">
            Payment Information Not Found
          </h1>

          <p className="text-gray-500 mt-2">
            Please open the invoice link again.
          </p>

          <button
            onClick={() => navigate("/")}
            className="mt-6 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
          >
            Go Home
          </button>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">

      <div className="max-w-lg w-full">

        {/* Success Card */}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

          {/* Success Header */}

          <div className="bg-green-50 p-8 text-center">

            <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-3xl text-green-600">
                ✓
              </span>
            </div>

            <h1 className="text-2xl font-bold text-green-700 mt-4">
              Payment Successful
            </h1>

            <p className="text-green-600 mt-2">
              Your payment has been received successfully.
            </p>

          </div>


          {/* Payment Details */}

          <div className="p-6">

            <h2 className="text-sm font-semibold text-gray-500 uppercase">
              Payment Details
            </h2>

            <div className="mt-4 space-y-4">

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Invoice Number
                </span>

                <span className="font-semibold text-gray-800">
                  {payment.invoice_number}
                </span>
              </div>


              <div className="flex justify-between">
                <span className="text-gray-500">
                  Amount Paid
                </span>

                <span className="font-semibold text-gray-800">
                  ₹{payment.amount}
                </span>
              </div>


              <div className="flex justify-between">
                <span className="text-gray-500">
                  Payment Method
                </span>

                <span className="font-semibold text-gray-800">
                  {payment.payment_method}
                </span>
              </div>


              <div className="flex justify-between">
                <span className="text-gray-500">
                  Status
                </span>

                <span className="font-semibold text-green-600">
                  {payment.status}
                </span>
              </div>

            </div>


            {/* Message */}

            <div className="mt-6 bg-gray-50 rounded-lg p-4">

              <p className="text-sm text-gray-600 text-center">
                Thank you for your payment.
                Your invoice has been marked as paid.
              </p>

            </div>

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

export default PaymentSuccess;