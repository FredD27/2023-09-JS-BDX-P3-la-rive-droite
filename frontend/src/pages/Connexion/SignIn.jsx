import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Input from "../../components/Inputs/Input";
import CheckboxCondition from "../../components/Inputs/CheckboxCondition";
import CompetenceSwitch from "../../components/Competence Switch/CompetenceSwitch";
import HeaderLongTitle from "../../components/Headers/HeaderLongTitle";
import ErrorMsg from "../../components/Alertes Messages/ErrorMsg";
import Title from "../../components/Titles/Title";
import SuccesMsg from "../../components/Alertes Messages/SuccesMsg";
import { useGlobalContext } from "../../contexts/GlobalContext";
import "./login-signin.css";
import "../../components/Inputs/input.css";
import "../../components/Boutons/button-maxi.css";
import "../../components/Inputs/checkbox-conditions.css";

function SignIn() {
  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const emailRegex = /[a-z0-9._]+@[a-z0-9-]+\.[a-z]{2,3}/;

  const globalContext = useGlobalContext();

  const [signIn, setSignIn] = useState({
    email: "",
    password: "",
    password2: "",
    lastname: "",
    firstname: "",
    phone: "",
    address: "",
    cguAgree: false,
    addCvNow: false,
  });

  const [allCompetences, setAllCompetences] = useState([]);
  const [selectedCompetences, setSelectedCompetences] = useState([]);

  const { apiService } = useGlobalContext();

  useEffect(() => {
    const getAllCompetences = async () => {
      try {
        const { data } = await apiService.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/skills`
        );
        setAllCompetences(data);
      } catch (err) {
        console.error(err);
      }
    };
    getAllCompetences();
  }, []);

  const handleCheckboxSwitch = async (competence) => {
    const isCompetenceSelected = selectedCompetences.some(
      (comp) => comp.id === competence.id
    );
    if (isCompetenceSelected) {
      const updatedCompetences = selectedCompetences.filter(
        (comp) => comp.id !== competence.id
      );
      setSelectedCompetences(updatedCompetences);
    } else {
      setSelectedCompetences((prevCompetences) => [
        ...prevCompetences,
        competence,
      ]);
    }
  };

  const handleSubmitSignIn = async (event) => {
    event.preventDefault();
    if (
      signIn.email === "" ||
      signIn.password === "" ||
      signIn.password2 === "" ||
      signIn.lastname === "" ||
      signIn.firstname === "" ||
      signIn.phone === "" ||
      signIn.address === ""
    ) {
      globalContext.setErrorMsg(true);
      globalContext.setMsgContent("Champs non remplis");
      setTimeout(() => {
        globalContext.setErrorMsg(false);
      }, 2000);
    } else if (!emailRegex.test(signIn.email)) {
      globalContext.setErrorMsg(true);
      globalContext.setMsgContent("L'adresse mail n'est pas correcte");
      setTimeout(() => {
        globalContext.setErrorMsg(false);
      }, 2000);
    } else if (signIn.password.length < 8) {
      globalContext.setErrorMsg(true);
      globalContext.setMsgContent("Le mot de passe n'est pas assez long");
      setTimeout(() => {
        globalContext.setErrorMsg(false);
      }, 2000);
    } else if (!passwordRegex.test(signIn.password)) {
      globalContext.setErrorMsg(true);
      globalContext.setMsgContent(
        "Le mot de passe doit contenir au moins : 1 majuscule, 1 minuscule, 1 chiffre, 1 caractère spéciale(@$!%*?&)"
      );
      setTimeout(() => {
        globalContext.setErrorMsg(false);
      }, 6000);
    } else if (signIn.password !== signIn.password2) {
      globalContext.setErrorMsg(true);
      globalContext.setMsgContent("Les mots de passes ne sont pas identiques");
      setTimeout(() => {
        globalContext.setErrorMsg(false);
      }, 2000);
    } else if (signIn.cguAgree === false) {
      globalContext.setErrorMsg(true);
      globalContext.setMsgContent(
        "Vous n'avez pas validé les conditions générales"
      );
      setTimeout(() => {
        globalContext.setErrorMsg(false);
      }, 2000);
    } else {
      globalContext.setSuccesMsg(true);
      globalContext.setMsgContent("Compte créé avec");
      setTimeout(() => {
        globalContext.setSuccesMsg(false);
      }, 2000);
      const response = await apiService.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users`,
        {
          ...signIn,
        }
      );

      await apiService.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/${
          response.insertId
        }/set/skills`,
        { competences: selectedCompetences.map((c) => c.id) }
      );

      globalContext.navigate("/login");
    }
  };

  return (
    <>
      <HeaderLongTitle textTitle="Création de votre compte" />
      <div id="sign" className="container-page with-rounded-border">
        <h1>S'inscrire</h1>
        <div className="champs-form">
          <form>
            <Input
              titleInput="E-mail *"
              holderText="john.doe@externatic.fr"
              fieldName="email"
              typeInput="email"
              valueInput={signIn}
              handleChange={(event) =>
                globalContext.handleChange(setSignIn, "email", event)
              }
            />
            <Input
              titleInput="Mot de passe *"
              holderText="************"
              fieldName="password"
              typeInput="password"
              valueInput={signIn}
              handleChange={(event) =>
                globalContext.handleChange(setSignIn, "password", event)
              }
            />
            <Input
              titleInput="Confirmer le mot de passe *"
              holderText="************"
              fieldName="password2"
              typeInput="password"
              valueInput={signIn}
              handleChange={(event) =>
                globalContext.handleChange(setSignIn, "password2", event)
              }
            />
            <div className="container-coordonnees">
              <Title titleText="Vos coordonnées" />
              <Input
                titleInput="Nom *"
                holderText="Votre nom"
                fieldName="lastname"
                valueInput={signIn}
                handleChange={(event) =>
                  globalContext.handleChange(setSignIn, "lastname", event)
                }
              />
              <Input
                titleInput="Prénom *"
                holderText="Votre prénom"
                fieldName="firstname"
                valueInput={signIn}
                handleChange={(event) =>
                  globalContext.handleChange(setSignIn, "firstname", event)
                }
              />
              <Input
                titleInput="Téléphone *"
                holderText="Numéro de téléphone"
                fieldName="phone"
                typeInput="tel"
                valueInput={signIn}
                handleChange={(event) =>
                  globalContext.handleChange(setSignIn, "phone", event)
                }
              />
              <Input
                titleInput="Addresse *"
                holderText="Adresse"
                fieldName="address"
                inputType="text"
                valueInput={signIn}
                handleChange={(event) =>
                  globalContext.handleChange(setSignIn, "address", event)
                }
              />
              <div className="container-switch">
                <h2 className="label-champs"> Cochez vos compétences *</h2>
                {allCompetences.map((competence) => {
                  return (
                    <CompetenceSwitch
                      key={competence.id}
                      textCompetence={competence.name.toUpperCase()}
                      fieldName={competence.name}
                      isChecked={selectedCompetences?.find(
                        (c) => competence.id === c.id
                      )}
                      handleChange={() => {
                        handleCheckboxSwitch(competence);
                      }}
                    />
                  );
                })}
              </div>
            </div>
            <CheckboxCondition
              textCondition="J'accepte les conditions générales d'Externatic"
              valueInput={signIn}
              fieldName="cguAgree"
              handleChange={() =>
                globalContext.handleCheckboxChange(setSignIn, "cguAgree")
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
            <button
              className="submit-btn-maxi"
              type="button"
              onClick={handleSubmitSignIn}
            >
              S'inscrire
            </button>
          </form>
        </div>
        <div className="small-paragraphe-info">
          <p>
            Vous avez déjà un compte ?
            <Link to="/login">
              <span> Connectez-vous</span>
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
export default SignIn;
