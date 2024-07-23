import React, { useEffect, useState } from "react";
import "./header.css";
import Logo from "../../Assets/Image/Denso_Logo.png";
import { Container, Nav, NavDropdown, Navbar } from "react-bootstrap";

function Header() {
  const [userName, setUsername] = useState("");
  const [admin, setAdmin] = useState(false);

  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      bg="dark"
      data-bs-theme="dark"
      className="bg-body-tertiary"
      style={{ height: 75, color: "white" }}
    >
      <Container>
        <Navbar.Brand>
          <img
            src={Logo}
            className="logoIcons"
            alt="logoTrace"
            style={{ marginRight: 30 }}
          />
          <span
            className="titleLogo"
            style={{ fontSize: 25, fontWeight: "bold" }}
          >
            VISION SYSTEM
          </span>
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
}

export default Header;
