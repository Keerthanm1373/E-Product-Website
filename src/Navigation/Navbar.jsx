import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
function Navigation() {
    const navigate = useNavigate();
    const handleAddProduct = () => {
        navigate("/addproduct");
      };
      const handleCart = () => {
        navigate("/cart");
      };
      const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
      };
      const handleHome = () => {
        navigate("/home");
      };
      const handleProfile = () => {
        navigate("/profile");
    };
        return(
        <nav className="bg-blue-100 shadow-lg px-6 py-4 sticky top-0 z-10">
        <div className="container mx-auto flex  items-center">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">E-Products</h1>
          <div className="flex items-center space-x-4">
          <button
              onClick={handleHome}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-200"
            >
              Home
            </button>
            <button
              onClick={handleAddProduct}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-200"
            >
              Add Product
            </button>
            <button
              onClick={handleCart}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-200"
            >
              🛒Cart
            </button>    
            </div>
          </div> 
          <div className="container mx-auto flex justify-end items-center">
          <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 mx-20 text-white px-4 py-2 rounded-lg transition duration-200"
            >
              Logout
            </button>
          <div
              onClick={handleProfile}
              className="w-14 h-14 rounded-full -mx-2  cursor-pointer bg-gray-400 hover:bg-gray-600 flex items-center justify-center transition duration-200 overflow-hidden "
            >
              <span className="text-xl">👤</span>
              </div>
              
            </div>
            </div>
            
        
      </nav>
    );
}

export default Navigation;