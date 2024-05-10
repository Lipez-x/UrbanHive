import { useEffect, useState } from "react";
import styles from "./Dashboard.module.css";
import api from "../../../utils/api";
import ImageProfile from "../../layouts/ImageProfile";

function MyLocations() {
  const [apartments, setApartments] = useState([]);
  const [token] = useState(localStorage.getItem("token") || "");

  useEffect(() => {
    api
      .get("/apartments/mylocations", {
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
        <h1>Minhas locações</h1>
      </div>
      <div className={styles.apartmentlist_container}>
        {apartments.length > 0 &&
          apartments.map((apartment) => (
            <div className={styles.apartmentlist_row} key={apartment._id}>
              <ImageProfile
                src={`http://localhost:5000/images/apartments/${apartment.image[0]}`}
                alt={apartments.location}
                width="px75"
              />
              <span className="bold">{apartment.location}</span>
              <div className={styles.contacts}>
                <p>
                  <span className="bold">Ligue para: </span>{" "}
                  {apartment.user.phone}
                </p>
                <p>
                  <span className="bold">Fale com: </span> {apartment.user.name}
                </p>
              </div>
              <div className={styles.action}>
                {apartment.avaliable ? (
                  <>
                    <p>Locação em processo</p>
                  </>
                ) : (
                  <p>Parabéns! O apartamento foi alugado</p>
                )}
              </div>
            </div>
          ))}
        {apartments.length === 0 && <p>Ainda não há locações</p>}
      </div>
    </section>
  );
}

export default MyLocations;
