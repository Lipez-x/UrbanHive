import api from "../utils/api";
import useFlashMessage from "./useFlashMessages";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function useAuth() {
  const [authenticaded, setAuthenticaded] = useState(false);
  const { setFlashMessage } = useFlashMessage();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      api.defaults.headers.Authorization = `Bearer ${JSON.parse(token)}`;
      setAuthenticaded(true);
    }
  }, []);

  async function register(user) {
    let msgText = "Cadastro realizado com successo";
    let msgType = "success";

    try {
      const data = await api.post("/users/register", user).then((response) => {
        return response.data;
      });
      await authUser(data);
    } catch (error) {
      msgText = error.response.data.msg;
      msgType = "error";
    }

    setFlashMessage(msgText, msgType);
  }

  async function authUser(data) {
    setAuthenticaded(true);
    localStorage.setItem("token", JSON.stringify(data.token));
    navigate("/");
  }

  async function login(user) {
    let msgText = "Login realizado com successo";
    let msgType = "success";

    try {
      const data = await api.post("/users/login", user).then((response) => {
        return response.data;
      });

      await authUser(data);
    } catch (error) {
      msgText = error.response.data.msg;
      msgType = "error";
    }

    setFlashMessage(msgText, msgType);
  }

  function logout() {
    const msgText = "Logout realizado com successo";
    const msgType = "success";
    setAuthenticaded(false);
    localStorage.removeItem("token");
    api.defaults.headers.Authorization = undefined;
    navigate("/");

    setFlashMessage(msgText, msgType);
  }

  return { authenticaded, register, logout, login };
}
