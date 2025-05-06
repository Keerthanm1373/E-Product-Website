import './App.css';
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Auth/Login";
import Register from "./Auth/Register";
import Home from "./Components/Home";
import AddProduct from "./Components/addproduct";
import Details from "./Components/Details";
import UpdateProduct from "./Components/UpdateProduct";
import Cart from "./Components/Cart";
import Profile from "./Components/Profile"
import AddAddress from "./Components/AddAddress";
import UpdateAddress from "./Components/UpdateAddress";
import ForgotPassword from './Auth/ForgotPassword';
function App() {
  return (
    
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/addProduct" element={<AddProduct />} />
        <Route path="/details/:id" element={<Details />} />
        <Route path="/updateProduct/:id" element={<UpdateProduct />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/updateAddress" element={<UpdateAddress />} />
        <Route path="/addAddress" element={<AddAddress />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

      </Routes>
    </Router>
  );
}
export default App;