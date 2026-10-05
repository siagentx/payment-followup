import api from "./api";

export const createPayment = (invoiceId, paymentData) => {
  return api.post(`/payments/${invoiceId}`, paymentData);
};

export const getPaymentHistory = (invoiceId) => {
  return api.get(`/payments/${invoiceId}`);
};

export const createPublicPayment = (publicToken, paymentData) => {
  return api.post(
    `/public-payments/${publicToken}`,
    paymentData
  );
};