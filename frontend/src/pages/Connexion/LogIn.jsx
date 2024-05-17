import { Link } from "react-router-dom";
import { useState } from "react";
import Input from "../../components/Inputs/Input";
import ButtonMaxi from "../../components/Boutons/ButtonMaxi";
import HeaderLongTitle from "../../components/Headers/HeaderLongTitle";
import { useGlobalContext } from "../../contexts/GlobalContext";
import ErrorMsg from "../../components/Alertes Messages/ErrorMsg";
import SuccesMsg from "../../components/Alertes Messages/SuccesMsg";
import "./login-signin.css";
import "../../components/Inputs/input.css";
import "../../components/Boutons/button-maxi.css";

function Login() {
  const { errorMsg, succesMsg, msgContent, handleChange } = useGlobalContext();
  const globalContext = useGlobalContext();

  const [logIn, setLogIn] = useState({
    email: "",
    password: "",
  });

  const handleSubmitLogIn = async () => {
    try {
      const data = await globalContext.apiService.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/login`,
        logIn
      );
      localStorage.setItem("token", data.token);

      globalContext.apiService.setToken(data.token);

      const result = await globalContext.apiService.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/me`
      );

      globalContext.setUser(result.data);
      globalContext.setIsAdmin(result.data.is_admin);
      globalContext.setMsgContent(
        `Content de vous revoir ${result.data.firstname} ${result.data.lastname}! Connexion effectuée avec`
      );
      globalContext.setSuccesMsg(true);
      setTimeout(() => {
        globalContext.setSuccesMsg(false);
        if (result.data.is_admin === 1) {
          globalContext.navigate("/dashboard/offer");
        } else {
          globalContext.navigate("/");
        }
      }, 2000);
    } catch (err) {
      console.error(err);
      globalContext.setMsgContent(`Mot de passe ou identifiant incorrect`);
      globalContext.setErrorMsg(true);
      setTimeout(() => {
        globalContext.setErrorMsg(false);
      }, 2000);
    }
    return null;
  };

  return (
    <>
      <HeaderLongTitle textTitle="Connexion" />
      <div id="log" className="container-page with-rounded-border">
        <h1> Se connecter</h1>
        <form>
          <div className="champs-form">
            <div>
              <Input
                titleInput="E-mail *"
                holderText="john.doe@externatic.fr"
                fieldName="email"
                valueInput={logIn}
                handleChange={(event) => handleChange(setLogIn, "email", event)}
              />
              <Input
                titleInput="Mot de passe *"
                holderText="************"
                fieldName="password"
                typeInput="password"
                valueInput={logIn}
                handleChange={(event) =>
                  handleChange(setLogIn, "password", event)
                }
              />
              <div>
                {errorMsg && <ErrorMsg message={msgContent} />}
                {succesMsg && <SuccesMsg message={msgContent} />}
              </div>
              <ButtonMaxi
                textBtn="Se connecter"
                clickFunc={handleSubmitLogIn}
              />
            </div>
          </div>
        </form>

        <div className="small-paragraphe-info">
          <p>
            Vous n'avez pas de compte ?
            <Link to="/signin">
              <span>Inscrivez-vous !</span>
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default Login;
