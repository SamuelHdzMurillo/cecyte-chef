import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../components/HomePage.css";
import {
  CUCHILLO,
  SARTEN,
  CAMARON,
  CHILE,
  CUCHARA,
  PILON,
  PITAHAYA,
  PEZ
} from "../assets/images";

function Programa({ onLoginClick }) {
  return (
    <div className="cecyte-chef-homepage">
      <Navbar onLoginClick={onLoginClick} />
      
      

     

      <Footer />
    </div>
  );
}

export default Programa;
