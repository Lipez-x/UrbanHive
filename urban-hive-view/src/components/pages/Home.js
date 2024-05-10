import api from "../../utils/api";
import styles from "./Home.module.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Home() {
  const [apartments, setApartments] = useState([]);

  useEffect(() => {
    api.get("/apartments").then((response) => {
      setApartments(response.data.apartments);
    });
  }, []);
  return (
    <section>
      <div className={styles.apartment_home_header}>
        <h1>Alugue</h1>
        <p>Veja os detalhes do apartamento e conheça o locatário</p>
      </div>
      <div className={styles.apartment_container}>
        {apartments.length > 0 &&
          apartments.map((apartments) => (
            <div className={styles.apartment_card}>
              <div
                style={{
                  backgroundImage: `url(http://localhost:5000/images/apartments/${apartments.image[0]})`,
                }}
                className={styles.apartment_card_image}
              ></div>
              <h3>{apartments.location}</h3>
              <p>
                <span className="bold">Aluguel:</span> R$ {apartments.price}
              </p>
              {apartments.avaliable ? (
                <Link to={`apartment/${apartments._id}`}>Mais detalhes</Link>
              ) : (
                <p className={styles.located_text}>Alugado</p>
              )}
            </div>
          ))}
        {apartments.length === 0 && (
          <p>Não há apartamentos para alugar no momento</p>
        )}
      </div>
    </section>
  );
}

export default Home;
