import { useState, useEffect } from "react";
import { v4 as uuid } from "uuid";
import "./add-experience.css";
import { useParams } from "react-router-dom";
import { format } from "date-fns";

import Input from "../../components/Inputs/Input";
import Select from "../../components/Inputs/Select";
import CheckboxCondition from "../../components/Inputs/CheckboxCondition";
import DateComponent from "../../components/Inputs/Date";
import TextArea from "../../components/Inputs/TextArea";
import HeaderCourt from "../../components/Headers/HeaderCourt";
import { useGlobalContext } from "../../contexts/GlobalContext";

// Import messages d'erreurs.
import ErrorMsg from "../../components/Alertes Messages/ErrorMsg";
import SuccesMsg from "../../components/Alertes Messages/SuccesMsg";

function EditExperience() {
  const globalContext = useGlobalContext();
  const { id } = useParams();

  const [addXp, setAddXp] = useState({
    id: uuid(),
    title: "",
    company: "",
    city: "",
    type: "",
    isWorking: false,
    dateBegin: "",
    dateEnd: "",
    description: null,
    cvId: null,
  });

  const handleAddXp = async (event) => {
    event.preventDefault();
    if (
      addXp.title === "" ||
      addXp.company === "" ||
      addXp.type === "" ||
      addXp.city === "" ||
      addXp.description === ""
    ) {
      globalContext.setErrorMsg(true);
      globalContext.setMsgContent("Veuillez remplir tous les champs");
      setTimeout(() => {
        globalContext.setErrorMsg(false);
      }, 2000);
    } else if (addXp.isWorking === false && addXp.dateBegin === "") {
      addXp.dateBegin = "1970-01-01";

      globalContext.setErrorMsg(true);
      globalContext.setMsgContent("Veuillez renseigner les dates");
      setTimeout(() => {
        globalContext.setErrorMsg(false);
      }, 2000);
    } else if (addXp.isWorking === true && addXp.dateBegin === "") {
      globalContext.setErrorMsg(true);
      globalContext.setMsgContent("Veuillez renseigner les dates");
      setTimeout(() => {
        globalContext.setErrorMsg(false);
      }, 2000);
    } else {
      try {
        // ici on récupère l'id du cv, et le back fait en sorte
        // que si l'utilisateur n'a pas de cv, il en crée un
        const { data } = await globalContext.apiService.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/users/${
            globalContext.user.id
          }/cvs`
        );
        const cvId = data.id;

        addXp.cvId = cvId;
        await globalContext.apiService.update(
          `${import.meta.env.VITE_BACKEND_URL}/api/experience/${id}`,
          addXp
        );

        globalContext.setMsgContent("L'expérience a été ajoutée avec");
        globalContext.setSuccesMsg(true);
        setTimeout(() => {
          globalContext.setSuccesMsg(false);
          globalContext.navigate("/profile");
        }, 2000);
      } catch (err) {
        console.error(err);
        globalContext.setErrorMsg(true);
        globalContext.setMsgContent("Formulaire incorrect");
        setTimeout(() => {
          globalContext.setErrorMsg(false);
        }, 2000);
      }
    }
  };
  useEffect(() => {
    const getExperience = async () => {
      try {
        const response = await globalContext.apiService.get(
          `http://localhost:3310/api/experience/${id}`
        );
        const experience = response.data;

        const dateBeginObject = new Date(experience.date_begin);
        const dateEndObject = new Date(experience.date_end);

        const formattedDateBegin = format(dateBeginObject, "yyyy-MM-dd");
        const formattedDateEnd = format(dateEndObject, "yyyy-MM-dd");

        experience.dateBegin = formattedDateBegin;
        experience.dateEnd = formattedDateEnd;

        setAddXp(experience);
      } catch (err) {
        console.error(err);
      }
    };
    getExperience();
  }, [id]);
  return (
    <>
      <HeaderCourt />
      <div className="container-page with-rounded-border">
        <h1>Modifier votre expérience</h1>
        <form onSubmit={handleAddXp}>
          <div className="container-input">
            <Input
              titleInput="Intitulé du poste *"
              holderText="Chef de projet"
              fieldName="title"
              inputType="text"
              valueInput={addXp}
              handleChange={(event) =>
                globalContext.handleChange(setAddXp, "title", event)
              }
            />
            <Input
              titleInput="Entreprise *"
              holderText="Inoxia"
              fieldName="company"
              inputType="text"
              valueInput={addXp}
              handleChange={(event) =>
                globalContext.handleChange(setAddXp, "company", event)
              }
            />
            <Input
              titleInput="Ville *"
              holderText="Bordeaux"
              fieldName="city"
              inputType="text"
              valueInput={addXp}
              handleChange={(event) =>
                globalContext.handleChange(setAddXp, "city", event)
              }
            />
            <Select
              titleSelect="Type de contrat *"
              valueSelect="CDI"
              fieldName="type"
              handleChange={(event) =>
                globalContext.handleChange(setAddXp, "type", event)
              }
            >
              <option value="stage" selected={addXp.type === "stage"}>
                Stage
              </option>
              <option value="alternance" selected={addXp.type === "alternance"}>
                Alternance
              </option>
              <option value="CDD" selected={addXp.type === "CDD"}>
                CDD
              </option>
              <option value="CDI" selected={addXp.type === "CDI"}>
                CDI
              </option>
            </Select>
            <div className="container-checkbox-experience">
              <CheckboxCondition
                textCondition="J'occupe ce poste actuellement"
                fieldName="condition-poste"
                handleChange={(event) =>
                  globalContext.handleCheckboxChange(
                    setAddXp,
                    "isWorking",
                    event
                  )
                }
              />
            </div>
            <DateComponent
              titleCalendar="De :"
              fieldName="dateBegin"
              handleChange={(event) =>
                globalContext.handleChange(setAddXp, "dateBegin", event)
              }
              value={addXp.dateBegin}
            />
            <DateComponent
              titleCalendar="Jusqu'au :"
              fieldName="dateEnd"
              handleChange={(event) =>
                globalContext.handleChange(setAddXp, "dateEnd", event)
              }
              value={addXp.dateEnd}
            />
            <TextArea
              titleInput="Description du poste *"
              holderText="Lorem ipsum dolor si amet"
              fieldName="description"
              inputType="text"
              valueInput={addXp}
              handleChange={(event) =>
                globalContext.handleChange(setAddXp, "description", event)
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
          </div>
          <button className="submit-btn-maxi" type="submit">
            Mettre à jour l'expérience
          </button>
        </form>
      </div>
    </>
  );
}

export default EditExperience;
