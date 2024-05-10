import { Link } from "react-router-dom";
import styles from "./Navbar.module.css";
import Logo from "../../assets/img/logo.png";
import { useContext } from "react";
import { Context } from "../../context/UserContext";

function Navbar() {
  const { authenticaded, logout } = useContext(Context);
  return (
    <nav className={styles.navbar}>
      <div className={styles.navbar_logo}>
        <img src={Logo} alt="Urban Hive" />
        <h2>Urban Hive</h2>
      </div>
      <ul>
        <li>
          <Link to="/">Alugar</Link>
        </li>
        {authenticaded ? (
          <>
            <li>
              <Link to="/apartment/mylocations">Minhas locações</Link>
            </li>
            <li>
              <Link to="/apartment/dashboard">Apartamentos</Link>
            </li>
            <li>
              <Link to="/user/profile">Perfil</Link>
            </li>
            <li onClick={logout}>Sair</li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login">Entrar</Link>
            </li>
            <li>
              <Link to="/register">Cadastrar</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
