import { useState, useEffect } from "react";
import { v4 as uuid } from "uuid";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";

import Input from "../../components/Inputs/Input";
import Select from "../../components/Inputs/Select";
import DateComponent from "../../components/Inputs/Date";
import TextArea from "../../components/Inputs/TextArea";
import HeaderCourt from "../../components/Headers/HeaderCourt";
import { useGlobalContext } from "../../contexts/GlobalContext";

// Import messages d'erreurs.
import ErrorMsg from "../../components/Alertes Messages/ErrorMsg";
import SuccesMsg from "../../components/Alertes Messages/SuccesMsg";

function EditFormation() {
  const {
    setErrorMsg,
    errorMsg,
    msgContent,
    setMsgContent,
    succesMsg,
    setSuccesMsg,
    handleChange,
    apiService,
    user,
  } = useGlobalContext();
  const { id } = useParams();
  const navigate = useNavigate();

  const [addCourse, setAddCourse] = useState({
    id: uuid(),
    level: "",
    domaine: "",
    name: "",
    dateBegin: "",
    dateEnd: "",
    description: "",
  });

  const handleAddCourse = async (event) => {
    event.preventDefault();
    if (
      addCourse.domaine === "" ||
      addCourse.name === "" ||
      addCourse.description === "" ||
      addCourse.level === ""
    ) {
      setErrorMsg(true);
      setMsgContent("Veuillez remplir tous les champs");
      setTimeout(() => {
        setErrorMsg(false);
      }, 2000);
    }
    if (addCourse.dateBegin === "" || addCourse.dateEnd === "") {
      setErrorMsg(true);
      setMsgContent("Veuillez renseigner les dates");
      setTimeout(() => {
        setErrorMsg(false);
      }, 2000);
    }
    if (addCourse.level === "- - -") {
      setErrorMsg(true);
      setMsgContent("Veuillez sélectionner un niveau valide");
      setTimeout(() => {
        setErrorMsg(false);
      }, 2000);
    } else {
      try {
        const { data } = await apiService.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/users/${user.id}/cvs`
        );
        const cvId = data.id;
        addCourse.cvId = cvId;

        await apiService.update(
          `${import.meta.env.VITE_BACKEND_URL}/api/course/${id}`,
          addCourse
        );

        setMsgContent("La formation a été modifiée avec succès");
        setSuccesMsg(true);
        setTimeout(() => {
          setSuccesMsg(false);
          navigate("/profile");
        }, 2000);
      } catch (err) {
        console.error(err);
        setErrorMsg(true);
        setMsgContent("Formulaire incorrect");
        setTimeout(() => {
          setErrorMsg(false);
        }, 2000);
      }
    }
  };
  useEffect(() => {
    const getCourse = async () => {
      try {
        const response = await apiService.get(
          `http://localhost:3310/api/course/${id}`
        );
        const course = response.data;

        const dateBeginObject = new Date(course.date_begin);
        const dateEndObject = new Date(course.date_end);

        const formattedDateBegin = format(dateBeginObject, "yyyy-MM-dd");
        const formattedDateEnd = format(dateEndObject, "yyyy-MM-dd");

        course.dateBegin = formattedDateBegin;
        course.dateEnd = formattedDateEnd;

        setAddCourse(course);
      } catch (err) {
        console.error(err);
      }
    };
    getCourse();
  }, [id]);
  return (
    <div>
      <HeaderCourt />
      <div className="container-page with-rounded-border">
        <h1>Modifier votre formation</h1>
        <form onSubmit={handleAddCourse}>
          <Select
            handleChange={(event) => handleChange(setAddCourse, "level", event)}
            fieldName="level"
            titleSelect="Niveau d'étude *"
          >
            <option
              value="Baccalaureat"
              selected={addCourse.type === "Baccalaureat"}
            >
              Baccalauréat
            </option>
            <option value="Licence" selected={addCourse.type === "Licence"}>
              Licence
            </option>
            <option value="Master 1" selected={addCourse.type === "Master 1"}>
              Master 1
            </option>
            <option value="Master 2" selected={addCourse.type === "Master 2"}>
              Master 2
            </option>
          </Select>
          <Input
            titleInput="Domaine *"
            holderText="Javascript/React"
            fieldName="domaine"
            inputType="text"
            valueInput={addCourse}
            handleChange={(event) =>
              handleChange(setAddCourse, "domaine", event)
            }
          />
          <Input
            titleInput="Nom de l'établissement *"
            holderText="Wild Code School"
            fieldName="name"
            inputType="text"
            valueInput={addCourse}
            handleChange={(event) => handleChange(setAddCourse, "name", event)}
          />
          <DateComponent
            titleCalendar="De :"
            fieldName="dateBegin"
            handleChange={(event) =>
              handleChange(setAddCourse, "dateBegin", event)
            }
            value={addCourse.dateBegin}
          />
          <DateComponent
            titleCalendar="Jusqu'au :"
            fieldName="dateEnd"
            handleChange={(event) =>
              handleChange(setAddCourse, "dateEnd", event)
            }
            value={addCourse.dateEnd}
          />
          <TextArea
            titleInput="Description de la formation *"
            holderText="Lorem ipsum dolor si amet"
            fieldName="description"
            inputType="text"
            valueInput={addCourse}
            handleChange={(event) =>
              handleChange(setAddCourse, "description", event)
            }
          />
          <div>
            {errorMsg && <ErrorMsg message={msgContent} />}
            {succesMsg && <SuccesMsg message={msgContent} />}
          </div>
          <button className="submit-btn-maxi" type="submit">
            Mettre à jour la formation
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditFormation;
