import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import HeaderLongResearch from "../../components/Headers/HeaderLongResearch";
import { useGlobalContext } from "../../contexts/GlobalContext";
import "./Home.css";
import CardOffre from "../../components/CardModel/CardOffre";

import HomeCard from "../../components/HomeCard/HomeCard";
import CardOffer from "../../components/CardModel/CardOffer";

function Home() {
  const navigate = useNavigate;
  const { apiService, user } = useGlobalContext();

  const [favorites, setFavorites] = useState([]);

  const toggleFavorite = (idAnnonce) => {
    const newListe = [...favorites, idAnnonce];
    setFavorites(newListe);
  };

  const [matchingOffers, setMatchingOffers] = useState([]);

  useEffect(() => {
    const getOfferMatch = async () => {
      try {
        if (!localStorage.getItem("token")) {
          return;
        }
        const response = await apiService.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/users/me/get-matching-offers`
        );
        setMatchingOffers(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    getOfferMatch();
  }, []);

  return (
    <div id="home">
      <HeaderLongResearch
        textTitle="Cabinet de recrutement informatique"
        textTitle2="Nos offres d'emplois"
      />
      <div className="container-page">
        <HomeCard />
        {user ? (
          <h1>
            Les offres qui <span>matchent !</span>
          </h1>
        ) : null}
        <div className="offer-container">
          {user ? (
            matchingOffers.map((offer) => (
              <CardOffre
                key={offer.id}
                offer={offer}
                toggleFavorite={toggleFavorite}
                goToOffer={() => {
                  navigate(`/offer/${offer.id}`);
                }}
              />
            ))
          ) : (
            <div className="offer-container-offer">
              <CardOffer />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
