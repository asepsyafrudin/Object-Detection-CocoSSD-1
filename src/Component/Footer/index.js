import React from "react";
import "./footer.css";
function Footer() {
  return (
    <footer
      id="sticky-footer"
      className="flex-shrink-0 py-4 text-white-50 footer"
      style={{ position: "fixed", bottom: 0, left: 0, width: "100%" }}
    >
      <div className="container text-center">
        Copyright &copy; 2024 Production Engineering Develpment, PT Denso
        Indonesia
      </div>
    </footer>
  );
}

export default Footer;
