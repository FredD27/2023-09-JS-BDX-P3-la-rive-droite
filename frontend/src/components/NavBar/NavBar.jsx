import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MDBNavbar,
  MDBContainer,
  MDBIcon,
  MDBNavbarNav,
  MDBNavbarToggler,
  MDBNavbarBrand,
  MDBCollapse,
} from "mdb-react-ui-kit";
import { useGlobalContext } from "../../contexts/GlobalContext";
import "./navBar.css";

export default function Navbar() {
  const { user, isAdmin, setIsAdmin, setUser, apiService } = useGlobalContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    apiService.setToken(null);
    setUser(null);
    setIsAdmin(null);
    // eslint-disable-next-line no-alert
    alert(`Déconnexion réussie`);
    return navigate("/");
  };

  const [openNavColor, setOpenNavColor] = useState(false);
  useEffect(() => {
    window.addEventListener("resize", () => {
      setOpenNavColor(false);
    });
  }, []);

  return (
    <>
      <MDBNavbar expand="lg" dark className="  navbar-bg-color no-shadow ">
        <MDBContainer className="container" fluid>
          <div className="container-nav">
            <MDBNavbarBrand href="#">
              <span className="navbar-big-logo">
                <h4 className="navbar-logo-title">EXTERNATIC</h4>
              </span>
            </MDBNavbarBrand>

            <MDBNavbarToggler
              type="button"
              data-target="#navbarColor02"
              aria-controls="navbarColor02"
              aria-expanded="false"
              aria-label="Toggle navigation"
              onClick={() => setOpenNavColor(!openNavColor)}
            >
              <MDBIcon icon="bars" fas className="navbar-burger-icon" />
            </MDBNavbarToggler>

            <MDBCollapse open={openNavColor} navbar>
              <MDBNavbarNav className="me-auto mb-2 mb-lg-0">
                <Link to="/">
                  <span className="active navbar-link">Accueil</span>
                </Link>
                {user ? (
                  <Link to="/profile">
                    <span className="navbar-link">Mon Compte</span>
                  </Link>
                ) : null}
                {/* <Link to="/profile/favorite">
                  <span className="navbar-link">Favoris</span>
                </Link> */}
                {user ? (
                  <Link to="/profile/add/formation">
                    <span className="navbar-link">Mes Formations</span>
                  </Link>
                ) : null}
                {user ? (
                  <Link to="/profile/add/experience">
                    <span className="navbar-link">Mes Expériences</span>
                  </Link>
                ) : null}
                {isAdmin ? (
                  <Link to="/dashboard/offer">
                    <span className="navbar-link">Espace admin</span>
                  </Link>
                ) : null}
                <div className="btn-nav">
                  {user ? (
                    <Link
                      to="/login"
                      className="navbar-link"
                      onClick={handleLogout}
                    >
                      Se déconnecter
                    </Link>
                  ) : (
                    <>
                      <Link to="/login">
                        <span className="navbar-link">Se connecter</span>
                      </Link>
                      <Link to="/signin">
                        <span className="navbar-link">S'inscrire</span>
                      </Link>
                    </>
                  )}
                </div>
              </MDBNavbarNav>
            </MDBCollapse>
          </div>
        </MDBContainer>
      </MDBNavbar>

      <br />
    </>
  );
}
