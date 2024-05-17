import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ButtonMini from "../../components/Boutons/ButtonMini";
import { useGlobalContext } from "../../contexts/GlobalContext";

function Dashboard1() {
  const navigate = useNavigate();
  const { apiService } = useGlobalContext();

  const [offers, setOffers] = useState([]);

  const deleteOffer = async (id) => {
    // eslint-disable-next-line no-alert
    if (!window.confirm("Voulez-vous vraiment supprimer cette offre ?")) {
      return;
    }

    try {
      await apiService.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/offer/${id}`
      );

      // Methode 01.
      // window.location.reload();
      // Methode 02.
      setOffers((previousOffer) =>
        previousOffer.filter((offer) => offer.id !== id)
      );
    } catch (err) {
      console.error(err);
    }
  };

  const fetchOffers = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/offer`
      );
      if (response.ok) {
        const data = await response.json();
        setOffers(data);
      } else {
        console.error("Aucune données n'a été récuperé.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-5">
        <h4 className="tab">Tableau de bord</h4>
        <div className="d-flex">
          <ButtonMini
            className="mx-3"
            textBtn="Ajouter une offre"
            onClick={() => {
              navigate("/dashboard/offer/add");
            }}
          />
          <ButtonMini
            className="mx-3"
            textBtn="Tableau d'Utilisateurs"
            onClick={() => {
              navigate("/dashboard/user");
            }}
          />
        </div>
      </div>
      <h4>Offres</h4>

      <table className="table">
        <thead>
          <tr>
            {["ID", "Entreprise", "Référent", "Actions"].map((element) => (
              <td key={element}>{element}</td>
            ))}
          </tr>
        </thead>
        <tbody>
          {offers.map((offer) => (
            <tr key={offer.id}>
              <td>{offer.id}</td>
              <td>{offer.company}</td>
              <td>{offer.email}</td>
              <td>
                <button
                  type="button"
                  aria-label="editoffer"
                  onClick={() => navigate(`/dashboard/edit-offer/${offer.id}`)}
                  className="invisible-button mx-2"
                >
                  <i className="fa-solid fa-pen" />
                </button>
                <button
                  type="button"
                  aria-label="getoffer"
                  onClick={() => navigate(`/offer/${offer.id}`)}
                  className="invisible-button mx-2"
                >
                  <i className="fa-solid fa-eye" />
                </button>
                <button
                  type="button"
                  aria-label="deleteoffer"
                  onClick={() => deleteOffer(offer.id)}
                  className="invisible-button mx-2"
                >
                  <i className="fa-solid fa-trash" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard1;
