import { useEffect, useState } from "react";
import styles from "./ApartmentDetails.module.css";
import { Link, useParams } from "react-router-dom";
import useFlashMessage from "../../../hooks/useFlashMessages";
import api from "../../../utils/api";

function ApartamentDetails() {
  const [apartment, setApartment] = useState({});
  const { id } = useParams();
  const { setFlashMessage } = useFlashMessage();
  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    api.get(`/apartments/${id}`).then((response) => {
      setApartment(response.data.apartment);
    });
  }, [id]);

  async function schedule() {
    let msgType = "success";

    const data = await api
      .patch(`apartments/schedule/${apartment._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
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
    <>
      {apartment.location && (
        <section className={styles.apartment_details_container}>
          <div className={styles.apartment_details_header}>
            <h1>{apartment.location}</h1>
            <p>
              Se tiver interesse marque uma visita para conhecer o apartamento
            </p>
          </div>
          <div className={styles.apartment_images}>
            {apartment.image.map((image, index) => (
              <img
                src={`http://localhost:5000/images/apartments/${image}`}
                alt={apartment.location}
                key={index}
              ></img>
            ))}
          </div>
          <p>
            <span className="bold">Preço:</span> R$ {apartment.price}
          </p>
          <p>
            <span className="bold">Contato:</span> {apartment.contact}
          </p>
          <p>
            <span className="bold">Descrição:</span> {apartment.description}
          </p>
          {token ? (
            <button onClick={schedule}>Solicitar visita</button>
          ) : (
            <p>
              <Link to="/register">Crie uma conta</Link>para solicitar a visita
            </p>
          )}
        </section>
      )}
    </>
  );
}

export default ApartamentDetails;
