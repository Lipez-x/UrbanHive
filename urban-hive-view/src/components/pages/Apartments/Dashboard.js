import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useFlashMessage from "../../../hooks/useFlashMessages";
import api from "../../../utils/api";
import ImageProfile from "../../layouts/ImageProfile";
import styles from "./Dashboard.module.css";

function Dashboard() {
  const [apartments, setApartments] = useState([]);
  const [token] = useState(localStorage.getItem("token") || "");
  const { setFlashMessage } = useFlashMessage();

  useEffect(() => {
    api
      .get("apartments/myapartments", {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      })
      .then((response) => {
        setApartments(response.data.apartments);
      });
  }, [token]);

  async function removeApartment(id) {
    let msgType = "success";

    const data = await api
      .delete(`/apartments/${id}`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      })
      .then((response) => {
        const updatedApartments = apartments.filter(
          (apartment) => apartment._id !== id
        );
        setApartments(updatedApartments);
        return response.data;
      })
      .catch((error) => {
        msgType = "error";
        return error.response.data;
      });

    setFlashMessage(data.msg, msgType);
  }

  async function concludeLocation(id) {
    let msgType = "success";
    const data = await api
      .patch(`/apartments/conclude/${id}`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
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
      <div className={styles.apartmentlist_header}>
        <h1>Meus apartamentos</h1>
        <Link to="/apartment/add">Cadastrar apartamento</Link>
      </div>
      <div className={styles.apartmentlist_container}>
        {apartments.length > 0 &&
          apartments.map((apartment) => (
            <div className={styles.apartmentlist_row} key={apartment._id}>
              <ImageProfile
                src={`http://localhost:5000/images/apartments/${apartment.image[0]}`}
                alt={apartment.location}
                width="px75"
              />
              <span className="bold">{apartment.location}</span>
              <div className={styles.action}>
                {apartment.avaliable ? (
                  <>
                    {apartment.lessee && (
                      <button
                        className={styles.conclude_btn}
                        onClick={() => {
                          concludeLocation(apartment._id);
                        }}
                      >
                        Concluir Locação
                      </button>
                    )}
                    <Link to={`/apartment/edit/${apartment._id}`}>Editar</Link>
                    <button
                      onClick={() => {
                        removeApartment(apartment._id);
                      }}
                    >
                      Excluir
                    </button>
                  </>
                ) : (
                  <p>Apartamento alugado</p>
                )}
              </div>
            </div>
          ))}
        {apartments.length === 0 && (
          <p>Você não tem apartamentos cadastrados</p>
        )}
      </div>
    </section>
  );
}

export default Dashboard;
