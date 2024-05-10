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
import Dashboard from "./components/pages/Apartments/Dashboard";
import AddApartment from "./components/pages/Apartments/AddApartment";
import EditApartment from "./components/pages/Apartments/EditApartment";
import ApartamentDetails from "./components/pages/Apartments/ApartmentDetails";
import MyLocations from "./components/pages/Apartments/MyLocations";

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
            <Route path="/apartment/dashboard" element={<Dashboard />} />
            <Route path="/apartment/add" element={<AddApartment />} />
            <Route path="/apartment/edit/:id" element={<EditApartment />} />
            <Route path="/apartment/:id" element={<ApartamentDetails />} />
            <Route path="/apartment/mylocations" element={<MyLocations />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </Container>
        <Footer />
      </UserProvider>
    </Router>
  );
}

export default App;
