import api from "./api";

export const loginUser = (email, password) => {
  const formData = new URLSearchParams();

  formData.append("username", email);
  formData.append("password", password);

  return api.post("/auth/login", formData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
};

export const getCurrentUser = () => {
  return api.get("/auth/me");
};