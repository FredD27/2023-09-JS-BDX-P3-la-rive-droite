import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ButtonMaxi from "../../components/Boutons/ButtonMaxi";
import Input from "../../components/Inputs/Input";
import Select from "../../components/Inputs/Select";
import TextArea from "../../components/Inputs/TextArea";
import HeaderCourt from "../../components/Headers/HeaderCourt";
// Import de Context.
import { useGlobalContext } from "../../contexts/GlobalContext";

// Import messages d'erreurs.
import ErrorMsg from "../../components/Alertes Messages/ErrorMsg";
import SuccesMsg from "../../components/Alertes Messages/SuccesMsg";
// Import styles.
import "./add-offer.css";

function AddOffer() {
  const navigate = useNavigate();
  const globalContext = useGlobalContext();

  const [offer, setOffer] = useState([]);
  const { id } = useParams();

  const fetchOffer = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/offer/${id}`
      );
      if (response.ok) {
        const data = await response.json();
        setOffer(data);
      } else {
        console.error("Echec de la récupération des données.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddOffer = () => {
    if (
      offer.title === "" ||
      offer.company === "" ||
      offer.type === "" ||
      offer.city === "" ||
      offer.mission === "" ||
      offer.search_profile === "" ||
      offer.work_place === "" ||
      offer.salary === "" ||
      offer.info === "" ||
      offer.email === ""
    ) {
      globalContext.setErrorMsg(true);
      globalContext.setMsgContent("Veuillez remplir tous les champs");
      setTimeout(() => {
        globalContext.setErrorMsg(false);
      }, 2000);
    } else {
      const updateOffer = async () => {
        globalContext.apiService.update(
          `${import.meta.env.VITE_BACKEND_URL}/api/offer/${id}`,
          offer,
          id
        );
      };

      updateOffer();
      globalContext.setMsgContent("L'offre a été modifiée avec");
      globalContext.setSuccesMsg(true);
      setTimeout(() => {
        globalContext.setSuccesMsg(false);
        navigate("/dashboard/offer");
      }, 2000);
    }
  };

  useEffect(() => {
    globalContext.unauthorized();
    fetchOffer();
  }, []);

  return (
    <div>
      <HeaderCourt />
      <div className="page-offer">
        <HeaderCourt />
        <div className="container-page with-rounded-border">
          <h1>Modifier une offre</h1>
          <h2>ID Offre = {id}</h2>
          <Input
            titleInput="Titre de l'offre"
            holderText="Développeur Web"
            fieldName="title"
            inputType="text"
            valueInput={offer}
            handleChange={(event) =>
              globalContext.handleChange(setOffer, "title", event)
            }
          />
          <Input
            titleInput="Société"
            holderText="BackMarket"
            fieldName="company"
            inputType="text"
            valueInput={offer}
            handleChange={(event) =>
              globalContext.handleChange(setOffer, "company", event)
            }
          />
          <Select
            titleSelect="Type de contrat"
            fieldName="type"
            handleChange={(event) =>
              globalContext.handleChange(setOffer, "type", event)
            }
          >
            <option value="stage" selected={offer.type === "stage"}>
              Stage
            </option>
            <option value="alternance" selected={offer.type === "alternance"}>
              Alternance
            </option>
            <option value="CDD" selected={offer.type === "CDD"}>
              CDD
            </option>
            <option value="CDI" selected={offer.type === "CDI"}>
              CDI
            </option>
          </Select>
          <Input
            titleInput="Ville"
            holderText="Bordeaux"
            inputType="text"
            fieldName="city"
            valueInput={offer}
            handleChange={(event) =>
              globalContext.handleChange(setOffer, "city", event)
            }
          />
          <TextArea
            titleInput="Missions"
            holderText="Pour cette mission, vous allez devoir réaliser ..."
            fieldName="mission"
            valueInput={offer}
            handleChange={(event) =>
              globalContext.handleChange(setOffer, "mission", event)
            }
          />
          <Input
            titleInput="Profil recherché"
            holderText="Junior avec 10 ans d'experience"
            fieldName="search_profile"
            inputType="text"
            valueInput={offer}
            handleChange={(event) =>
              globalContext.handleChange(setOffer, "search_profile", event)
            }
          />
          <Input
            titleInput="Lieux de travail"
            holderText="Présentiel"
            fieldName="work_place"
            inputType="text"
            valueInput={offer}
            handleChange={(event) =>
              globalContext.handleChange(setOffer, "work_place", event)
            }
          />
          <Input
            titleInput="Salaire"
            holderText="100k"
            fieldName="salary"
            inputType="text"
            valueInput={offer}
            handleChange={(event) =>
              globalContext.handleChange(setOffer, "salary", event)
            }
          />
          <TextArea
            titleInput="Infos complémentaires"
            holderText="Le travail est cool"
            fieldName="info"
            valueInput={offer}
            handleChange={(event) =>
              globalContext.handleChange(setOffer, "info", event)
            }
          />
          <Input
            titleInput="Email du client lié à l'offre"
            holderText="Votre email"
            fieldName="email"
            inputType="email"
            valueInput={offer}
            handleChange={(event) =>
              globalContext.handleChange(setOffer, "email", event)
            }
          />
          <div>
            {globalContext.errorMsg && (
              <ErrorMsg message={globalContext.msgContent} />
            )}
            {globalContext.succesMsg && (
              <SuccesMsg message={globalContext.msgContent} />
            )}
          </div>
          <ButtonMaxi textBtn="Modifier l'offre" clickFunc={handleAddOffer} />
        </div>
      </div>
    </div>
  );
}

export default AddOffer;
