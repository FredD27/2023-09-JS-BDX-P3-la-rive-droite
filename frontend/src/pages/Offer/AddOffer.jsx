import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
import CompetenceSwitch from "../../components/Competence Switch/CompetenceSwitch";

function AddOffer() {
  const navigate = useNavigate();

  const [addOffer, setAddOffer] = useState({
    title: "",
    company: "",
    type: "",
    city: "",
    mission: "",
    search_profile: "",
    work_place: "",
    salary: "",
    info: "",
    email: "",
  });

  const globalContext = useGlobalContext();
  const [skills, setSkills] = useState([]);
  const [checkedSkills, setCheckedSkills] = useState([]);
  const switchClicked = (skillName) => {
    if (checkedSkills.includes(skillName)) {
      setCheckedSkills(checkedSkills.filter((skill) => skill !== skillName));
    } else {
      setCheckedSkills([...checkedSkills, skillName]);
    }
  };

  const handleAddOffer = () => {
    if (
      addOffer.title === "" ||
      addOffer.company === "" ||
      addOffer.type === "" ||
      addOffer.city === "" ||
      addOffer.mission === "" ||
      addOffer.search_profile === "" ||
      addOffer.work_place === "" ||
      addOffer.salary === "" ||
      addOffer.info === "" ||
      addOffer.email === ""
    ) {
      globalContext.setErrorMsg(true);
      globalContext.setMsgContent("Veuillez remplir tous les champs");
      setTimeout(() => {
        globalContext.setErrorMsg(false);
      }, 2000);
    } else {
      const postOffer = async () => {
        const resOffer = await globalContext.apiService.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/offer`,
          addOffer
        );

        const checkedSkillsId = checkedSkills.map((skillName) => {
          const matchingSkill = skills.find(
            (skill) => skill.name === skillName
          );
          return matchingSkill.id;
        });

        await globalContext.apiService.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/offers/${
            resOffer.id
          }/add/skills`,
          { competences: checkedSkillsId }
        );
      };

      postOffer();

      globalContext.setMsgContent("L'offre a été ajouté avec");
      globalContext.setSuccesMsg(true);
      setTimeout(() => {
        globalContext.setSuccesMsg(false);
        navigate("/dashboard/offer");
      }, 2000);

      setAddOffer({
        title: "",
        company: "",
        type: "",
        city: "",
        mission: "",
        search_profile: "",
        work_place: "",
        salary: "",
        info: "",
        email: "",
      });
    }
  };

  useEffect(() => {
    const getSkills = async () => {
      try {
        const response = await globalContext.apiService.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/skills`
        );
        setSkills(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    getSkills();
  }, []);
  return (
    <div>
      <HeaderCourt />

      <div className="page-offer">
        <HeaderCourt />
        <div className="container-page with-rounded-border">
          <h1>Ajouter une offre</h1>
          <Input
            titleInput="Titre de l'offre"
            holderText="Développeur Web"
            fieldName="title"
            inputType="text"
            valueInput={addOffer}
            handleChange={(event) =>
              globalContext.handleChange(setAddOffer, "title", event)
            }
          />
          <Input
            titleInput="Société"
            holderText="BackMarket"
            fieldName="company"
            inputType="text"
            valueInput={addOffer}
            handleChange={(event) =>
              globalContext.handleChange(setAddOffer, "company", event)
            }
          />
          <Select
            titleSelect="Type de contrat"
            fieldName="type"
            handleChange={(event) =>
              globalContext.handleChange(setAddOffer, "type", event)
            }
          >
            <option value="stage">Stage</option>
            <option value="alternance">Alternance</option>
            <option value="CDD">CDD</option>
            <option value="CDI">CDI</option>
          </Select>
          <Input
            titleInput="Ville"
            holderText="Bordeaux"
            inputType="text"
            fieldName="city"
            valueInput={addOffer}
            handleChange={(event) =>
              globalContext.handleChange(setAddOffer, "city", event)
            }
          />
          <TextArea
            titleInput="Missions"
            holderText="Pour cette mission, vous allez devoir réaliser ..."
            fieldName="mission"
            valueInput={addOffer}
            handleChange={(event) =>
              globalContext.handleChange(setAddOffer, "mission", event)
            }
          />
          <Input
            titleInput="Profil recherché"
            holderText="Junior avec 10 ans d'experience"
            fieldName="search_profile"
            inputType="text"
            valueInput={addOffer}
            handleChange={(event) =>
              globalContext.handleChange(setAddOffer, "search_profile", event)
            }
          />
          <Input
            titleInput="Lieux de travail"
            holderText="Présentiel"
            fieldName="work_place"
            inputType="text"
            valueInput={addOffer}
            handleChange={(event) =>
              globalContext.handleChange(setAddOffer, "work_place", event)
            }
          />
          <Input
            titleInput="Salaire"
            holderText="100k"
            fieldName="salary"
            inputType="text"
            valueInput={addOffer}
            handleChange={(event) =>
              globalContext.handleChange(setAddOffer, "salary", event)
            }
          />
          <TextArea
            titleInput="Infos complémentaires"
            holderText="Le travail est cool"
            fieldName="info"
            valueInput={addOffer}
            handleChange={(event) =>
              globalContext.handleChange(setAddOffer, "info", event)
            }
          />
          <Input
            titleInput="Email du client lié à l'offre"
            holderText="Votre email"
            fieldName="email"
            inputType="email"
            valueInput={addOffer}
            handleChange={(event) =>
              globalContext.handleChange(setAddOffer, "email", event)
            }
          />
          {skills.map((skill) => (
            <CompetenceSwitch
              key={skill.id}
              textCompetence={skill.name}
              handleChange={() => {
                switchClicked(skill.name);
              }}
              isChecked={checkedSkills.includes(skill.name)}
            />
          ))}

          <div>
            {globalContext.errorMsg && (
              <ErrorMsg message={globalContext.msgContent} />
            )}
            {globalContext.succesMsg && (
              <SuccesMsg message={globalContext.msgContent} />
            )}
          </div>
          <ButtonMaxi textBtn="Ajouter l'offre" clickFunc={handleAddOffer} />
        </div>
      </div>
    </div>
  );
}

export default AddOffer;
