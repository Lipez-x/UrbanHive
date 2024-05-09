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

  return (
    <section>
      <div className={styles.apartmentlist_header}>
        <h1>Meus appartamentos</h1>
        <Link to="/apartment/add">Cadastrar apartamento</Link>
      </div>
      <div className={styles.apartmentlist_container}>
        {apartments.length > 0 &&
          apartments.map((apartments) => (
            <div className={styles.apartmentlist_row} key={apartments._id}>
              <ImageProfile
                src={`http://localhost:5000/images/apartments/${apartments.image[0]}`}
                alt={apartments.location}
                width="px75"
              />
              <span className="bold">{apartments.location}</span>
              <div className={styles.action}>
                {apartments.avaliable ? (
                  <>
                    {apartments.lessee && (
                      <button className={styles.conclude_btn}>
                        Concluir Locação
                      </button>
                    )}
                    <Link to={`/apartment/edit/${apartments._id}`}>Editar</Link>
                    <button>Excluir</button>
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
