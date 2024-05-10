import { useEffect, useState } from "react";
import styles from "./AddApartment.module.css";
import { useParams } from "react-router-dom";
import useFlashMessage from "../../../hooks/useFlashMessages";
import api from "../../../utils/api";
import ApartmentForm from "../../form/ApartmentForm";

function EditApartment() {
  const [apartment, setApartment] = useState({});
  const [token] = useState(localStorage.getItem("token") || "");
  const { id } = useParams();
  const { setFlashMessage } = useFlashMessage();

  useEffect(() => {
    api
      .get(`/apartments/${id}`, {
        Authorization: `Bearer ${JSON.parse(token)}`,
      })
      .then((response) => {
        setApartment(response.data.apartment);
      });
  }, [token, id]);

  async function updateApartment(apartment) {
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
      .patch(`apartments/${apartment._id}`, formData, {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        msgType = "error";
        return error.response.data;
      });

    setFlashMessage(data.msg, msgType);
  }
  return (
    <section>
      <div className={styles.addapartment_header}>
        <h1>Editando o apartamento: {apartment.price}</h1>
        <p>Depois da edição os dados serão atualizados no sistema</p>
      </div>
      {apartment.location && (
        <ApartmentForm
          handleSubmit={updateApartment}
          btnText="Atualizar"
          apartmentData={apartment}
        />
      )}
    </section>
  );
}

export default EditApartment;
