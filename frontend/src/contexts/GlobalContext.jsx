import { useState, createContext, useContext, useMemo } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import ApiService from "../services/api.service";

const GlobalContext = createContext();

function GlobalContextProvider({ children, apiService }) {
  // Messages d'alertes.
  const givenData = useLoaderData();
  const [isAdmin, setIsAdmin] = useState(
    givenData?.preloadUser?.data?.is_admin
  );
  const [user, setUser] = useState(givenData?.preloadUser?.data);

  const [errorMsg, setErrorMsg] = useState(false);
  const [succesMsg, setSuccesMsg] = useState(false);
  const [msgContent, setMsgContent] = useState("");

  const navigate = useNavigate();

  const handleChange = (callback, fieldName, event) => {
    callback((previousData) => ({
      ...previousData,
      [fieldName]: event.target.value,
    }));
  };

  const handleCheckboxChange = (callback, fieldName) => {
    callback((prevData) => {
      const newValue = !prevData[fieldName];
      return {
        ...prevData,
        [fieldName]: newValue,
      };
    });
  };

  function unauthorized() {
    if (!isAdmin) {
      navigate("/");
    }
  }

  const values = useMemo(
    () => ({
      handleChange,
      handleCheckboxChange,
      errorMsg,
      setErrorMsg,
      succesMsg,
      setSuccesMsg,
      msgContent,
      setMsgContent,
      navigate,
      isAdmin,
      setIsAdmin,
      user,
      setUser,
      apiService,
      unauthorized,
      // handleLog,
    }),
    [
      handleChange,
      handleCheckboxChange,
      errorMsg,
      setErrorMsg,
      succesMsg,
      setSuccesMsg,
      msgContent,
      setMsgContent,
      navigate,
      isAdmin,
      setIsAdmin,
      user,
      setUser,
      apiService,
      unauthorized,
      // handleLog,
    ]
  );

  return (
    <GlobalContext.Provider value={values}>{children}</GlobalContext.Provider>
  );
}

GlobalContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
  apiService: PropTypes.instanceOf(ApiService).isRequired,
};

export default GlobalContextProvider;

export const useGlobalContext = () => useContext(GlobalContext);
