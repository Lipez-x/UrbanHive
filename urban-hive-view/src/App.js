import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/pages/Auth/Login";
import Register from "./components/pages/Auth/Register";
import Home from "./components/pages/Home";
import Footer from "./components/layouts/Footer";
import Navbar from "./components/layouts/Navbar";
import Container from "./components/layouts/Container";
import Message from "./components/layouts/Message";
import { UserProvider } from "./context/UserContext";
import Profile from "./components/pages/User/Profile";

function App() {
  return (
    <Router>
      <UserProvider>
        <Navbar />
        <Container>
          <Message />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/user/profile" element={<Profile />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </Container>
        <Footer />
      </UserProvider>
    </Router>
  );
}

export default App;
