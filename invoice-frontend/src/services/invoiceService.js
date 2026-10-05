import api from "./api";

export const getInvoices = () => {
  return api.get("/invoices/");
};

export const getInvoice = (invoiceId) => {
  return api.get(`/invoices/${invoiceId}`);
};

export const createInvoice = (invoiceData) => {
  return api.post("/invoices/", invoiceData);
};

export const updateInvoice = (invoiceId, invoiceData) => {
  return api.put(`/invoices/${invoiceId}`, invoiceData);
};

export const deleteInvoice = (invoiceId) => {
  return api.delete(`/invoices/${invoiceId}`);
};