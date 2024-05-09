import { useState } from "react";
import ApartmentForm from "../../form/ApartmentForm";
import styles from "./AddApartment.module.css";
import useFlashMessage from "../../../hooks/useFlashMessages";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/api";

function AddApartment() {
  const [token] = useState(localStorage.getItem("token") || "");
  const { setFlashMessage } = useFlashMessage();
  const navigate = useNavigate();
  async function registerApartment(apartment) {
    let msgType = "success";
    const formData = new FormData();

    await Object.keys(apartment).forEach((key) => {
      if (key === "images") {
        for (let i = 0; i < apartment[key].length; i++) {
          formData.append("images", apartment[key][i]);
        }
      } else {
        formData.append(key, apartment[key]);
      }
    });

    const data = await api
      .post("apartments/create", formData, {
        Authorization: `Bearer ${JSON.parse(token)}`,
        "Content-Type": "multipart/form-data",
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        msgType = "error";
        return error.response.data;
      });

    if (msgType !== "error") {
      navigate("/apartment/dashboard");
    }

    setFlashMessage(data.msg, msgType);
  }
  return (
    <section className={styles.addapartment_header}>
      <div>
        <h1>Cadastre um apartamento</h1>
        <p>Depois ele ficará disponível para locação</p>
      </div>
      <ApartmentForm
        handleSubmit={registerApartment}
        btnText="Cadastrar apartamento"
      />
    </section>
  );
}

export default AddApartment;
