import { Link } from "react-router-dom";
import Input from "../../components/Inputs/Input";
import CheckboxCondition from "../../components/Inputs/CheckboxCondition";
import HeaderLongTitle from "../../components/Headers/HeaderLongTitle";
import ButtonMaxi from "../../components/Boutons/ButtonMaxi";
import ErrorMsg from "../../components/Alertes Messages/ErrorMsg";
import SuccesMsg from "../../components/Alertes Messages/SuccesMsg";
import { useGlobalContext } from "../../contexts/GlobalContext";
import { useSignContext } from "../../contexts/SignContext";
import "./login-signin.css";
import "../../components/Inputs/input.css";
import "../../components/Boutons/button-maxi.css";
import "../../components/Inputs/checkbox-conditions.css";

function SignIn() {
  const { handleChange } = useGlobalContext();

  const {
    errorMsg,
    succesMsg,
    msgContent,
    signIn,
    setSignIn,
    handleSubmitSignIn,
  } = useSignContext();

  return (
    <>
      <HeaderLongTitle textTitle="Création de votre compte" />
      <div className="container-page container-general-login">
        <h1>S'inscrire</h1>
        <div className="champs-form">
          <div>
            <Input
              titleInput="Nom d'utilisateur *"
              holderText="John Doe"
              fieldName="userName"
              valueInput={signIn}
              handleChange={(event) =>
                handleChange(setSignIn, "userName", event)
              }
            />
            <Input
              titleInput="E-mail *"
              holderText="john.doe@externatic.fr"
              fieldName="email"
              typeInput="email"
              valueInput={signIn}
              handleChange={(event) => handleChange(setSignIn, "email", event)}
            />
            <Input
              titleInput="Mot de passe *"
              holderText="************"
              fieldName="password"
              typeInput="password"
              valueInput={signIn}
              handleChange={(event) =>
                handleChange(setSignIn, "password", event)
              }
            />
            <Input
              titleInput="Confirmer le mot de passe *"
              holderText="************"
              fieldName="password2"
              typeInput="password"
              valueInput={signIn}
              handleChange={(event) =>
                handleChange(setSignIn, "password2", event)
              }
            />
            <CheckboxCondition
              textCondition="J'accepte les conditions d' *"
              fieldName="cguAgree"
            />
            {/* <a href="#">Externatic</a> */}
            <CheckboxCondition
              textCondition="Je veux créer ou télécharger mon cv maintenant !"
              fieldName="addCvNow"
            />
            <div>
              {errorMsg && <ErrorMsg message={msgContent} />}
              {succesMsg && <SuccesMsg message={msgContent} />}
            </div>
            <ButtonMaxi textBtn="S'inscrire" clickFunc={handleSubmitSignIn} />
          </div>
        </div>

        <div className="small-paragraphe-info">
          <p>
            Vous avez déjà un compte ?
            <Link to="/login">
              <span>Connectez-vous</span>
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default SignIn;
