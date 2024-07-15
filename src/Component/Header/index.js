import React, { useEffect, useState } from "react";
import "./header.css";
// import Logo from "../../../Assets/Image/case-study.png";
import { Container, Nav, NavDropdown, Navbar } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { LuHome, LuSearch } from "react-icons/lu";
import { FcAbout } from "react-icons/fc";

function Header() {
  const [userName, setUsername] = useState("");
  const [admin, setAdmin] = useState(false);

  return (
    <Navbar className="bg-body-tertiary" bg="dark" data-bs-theme="dark">
      <Container>
        <Navbar.Brand href="#home">VISION</Navbar.Brand>
      </Container>
    </Navbar>
  );
}

export default Header;
