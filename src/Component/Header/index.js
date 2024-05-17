import React, { useEffect, useState } from "react";
import "./header.css";
import Logo from "../../../Assets/Image/case-study.png";
import { Container, Nav, NavDropdown, Navbar } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { LuHome, LuSearch } from "react-icons/lu";
import { FcAbout } from "react-icons/fc";

function Header() {
  const [userName, setUsername] = useState("");
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("userTracing")) {
      const user = JSON.parse(sessionStorage.getItem("userTracing"));
      if (user) {
        const { USERNAME } = user;
        setUsername(USERNAME);
        if (user.ROLE === 1) {
          setAdmin(true);
        } else {
          setAdmin(false);
        }
      }
    }
  }, []);

  const navigate = useNavigate();
  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  const handleAdminMenu = () => {
    navigate("/Admin");
  };
  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      bg="dark"
      data-bs-theme="dark"
      className="bg-body-tertiary"
      style={{ color: "white" }}
    >
      <Container>
        <Navbar.Brand>
          <Link
            to="/Dashboard"
            style={{ textDecoration: "none", color: "#ffff" }}
          >
            <img src={Logo} className="logoIcons" alt="logoTrace" />
            <span
              className="titleLogo"
              style={{ fontSize: 25, fontWeight: "bold" }}
            >
              Tracepro
            </span>
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        {userName ? (
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              {" "}
              <Link
                to={"/Dashboard"}
                style={{
                  textDecorationLine: "none",
                  color: "white",
                  fontSize: 15,
                  marginRight: 20,
                  marginLeft: 20,
                }}
              >
                <LuHome style={{ marginRight: 3 }} />
                Home
              </Link>{" "}
              <Link
                to={"/Tracing"}
                style={{
                  textDecorationLine: "none",
                  color: "white",
                  fontSize: 15,
                  marginRight: 20,
                }}
              >
                <LuSearch style={{ marginRight: 3 }} />
                Tracing
              </Link>
              <Link
                to={"/About"}
                style={{
                  textDecorationLine: "none",
                  color: "white",
                  fontSize: 15,
                  marginRight: 20,
                }}
              >
                <FcAbout style={{ marginRight: 3 }} />
                About
              </Link>
            </Nav>
            <Nav>
              {/* <Nav.Link href="#deets">More deets</Nav.Link>
   <Nav.Link eventKey={2} href="#memes">
     Dank memes
   </Nav.Link> */}
              <NavDropdown
                title={`Welcome, ${userName.toUpperCase()}`}
                id="collapsible-nav-dropdown"
                style={{ color: "white", fontSize: 18 }}
              >
                <NavDropdown.Item onClick={handleLogout}>
                  {" "}
                  Logout
                </NavDropdown.Item>
                {admin && (
                  <NavDropdown.Item onClick={handleAdminMenu}>
                    {" "}
                    Admin Menu
                  </NavDropdown.Item>
                )}

                {/* <NavDropdown.Item href="#action/3.2">
       Another action
     </NavDropdown.Item>
     <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
     <NavDropdown.Divider />
     <NavDropdown.Item href="#action/3.4">
       Separated link
     </NavDropdown.Item> */}
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        ) : (
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto"> </Nav>
            <Nav>
              {/* <Nav.Link href="#deets">More deets</Nav.Link>
 <Nav.Link eventKey={2} href="#memes">
   Dank memes
 </Nav.Link> */}

              <Link
                to={"/Tracing"}
                style={{
                  textDecorationLine: "none",
                  color: "white",
                  fontSize: 18,
                  marginRight: 10,
                }}
              >
                Tracing
              </Link>
            </Nav>
          </Navbar.Collapse>
        )}
      </Container>
    </Navbar>
  );
}

export default Header;
