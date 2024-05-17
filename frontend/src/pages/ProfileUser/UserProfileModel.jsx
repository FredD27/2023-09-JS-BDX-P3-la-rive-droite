import { useEffect, useState } from "react";
// import PropTypes from "prop-types";
import "./user-profile-model.css";
import { useNavigate } from "react-router-dom";
import Unknow from "../../assets/no-profile.jpg";
import ButtonMaxi from "../../components/Boutons/ButtonMaxi";
import { useGlobalContext } from "../../contexts/GlobalContext";
import ErrorMsg from "../../components/Alertes Messages/ErrorMsg";
import SuccesMsg from "../../components/Alertes Messages/SuccesMsg";
import CardFormation from "../../components/CardModel/CardFormation";
import CardExperience from "../../components/CardModel/CardExperience";
import AddDetailsCV from "../../components/Add Something/AddSomething";
import HeaderCourt from "../../components/Headers/HeaderCourt";

function UserProfileModel() {
  const navigate = useNavigate();
  const globalContext = useGlobalContext();
  const [getProfile, setGetProfile] = useState({});
  const [experiences, setExperiences] = useState([]);
  const [courses, setCourses] = useState([]);

  const getUserProfile = async () => {
    try {
      const response = await globalContext.apiService.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/me`
      );
      setGetProfile(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCvId = async () => {
    const cvData = await globalContext.apiService.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/users/${
        globalContext.user.id
      }/cvs`
    );

    return cvData.data.id;
  };

  const fetchExperiences = async () => {
    const cvid = await fetchCvId();
    const experienceData = await globalContext.apiService.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/experiences/by-cv-id/${cvid}`
    );
    setExperiences(experienceData.data);
  };

  const fetchCourses = async () => {
    const cvid = await fetchCvId();
    const courseData = await globalContext.apiService.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/courses/by-cv-id/${cvid}`
    );
    setCourses(courseData.data);
  };

  const handleExperienceDelete = async (id) => {
    // eslint-disable-next-line no-alert
    if (!window.confirm("Voulez-vous vraiment supprimer cette expérience ?")) {
      return;
    }
    try {
      await globalContext.apiService.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/experience/${id}`
      );
      globalContext.setSuccesMsg(true);
      globalContext.setMsgContent("Votre expérience a bien été supprimée");
      fetchExperiences();
      setTimeout(() => {
        globalContext.setSuccesMsg(false);
      }, 2000);
    } catch (err) {
      console.error(err);
      globalContext.setErrorMsg(true);
      globalContext.setMsgContent("Une erreur est survenue");
      setTimeout(() => {
        globalContext.setErrorMsg(false);
      }, 2000);
    }
  };

  const handleCourseDelete = async (id) => {
    // eslint-disable-next-line no-alert
    if (!window.confirm("Voulez-vous vraiment supprimer cette formation ?")) {
      return;
    }
    try {
      await globalContext.apiService.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/course/${id}`
      );
      globalContext.setSuccesMsg(true);
      globalContext.setMsgContent("Votre formation a bien été supprimée");
      fetchCourses();
      setTimeout(() => {
        globalContext.setSuccesMsg(false);
      }, 2000);
    } catch (err) {
      console.error(err);
      globalContext.setErrorMsg(true);
      globalContext.setMsgContent("Une erreur est survenue");
      setTimeout(() => {
        globalContext.setErrorMsg(false);
      }, 2000);
    }
  };

  useEffect(() => {
    fetchExperiences();
    fetchCourses();
    getUserProfile();
    fetchCvId();
  }, []);

  return (
    <div id="user-profile-model">
      <HeaderCourt />

      <div className="container-page with-rounded-border">
        <div className="img-profil">
          <img
            className="img-fluid"
            src={
              globalContext.user.upload_url
                ? `${import.meta.env.VITE_BACKEND_URL}/${
                    globalContext.user.upload_url
                  }`
                : Unknow
            }
            alt=""
          />
        </div>
        <h1>
          {getProfile.firstname} {getProfile.lastname}
        </h1>
        <div className="container-info-profile">
          <h2 className="label-champs">Vos coordonnées</h2>

          <p>Nom : {getProfile.lastname}</p>
          <p>Prénom : {getProfile.firstname}</p>
          <p>Email : {getProfile.email}</p>
          <p>Téléphone : {getProfile.phone}</p>
          <p>Adresse : {getProfile.address}</p>
        </div>
        <h2 className="label-champs">Vos compétences</h2>
        <div className="competence-match">
          {getProfile.competences?.map((competence) => {
            return (
              <span className="competence is-matching" key={competence.id}>
                {competence.name}
              </span>
            );
          })}
        </div>
        <ButtonMaxi
          textBtn="Modifier votre profil"
          clickFunc={() => navigate(`/profile/edit/${getProfile.id}`)}
        />

        <AddDetailsCV
          addDetail="Expériences professionnelles"
          url="/profile/add/experience"
        />
        <div className="experience-container">
          {experiences &&
            experiences.map((experience) => (
              <CardExperience
                key={experience.id}
                id={experience.id}
                company={experience.company}
                title={experience.title}
                type={experience.type}
                city={experience.city}
                dateBegin={experience.date_begin}
                isWorking={!!experience.is_working}
                dateEnd={experience.date_end}
                description={experience.description}
                handleExperienceDelete={handleExperienceDelete}
              />
            ))}
        </div>
        <AddDetailsCV addDetail="Formations" url="/profile/add/formation" />
        <div className="formation-container">
          {courses &&
            courses.map((course) => (
              <CardFormation
                key={course.id}
                id={course.id}
                level={course.level}
                domaine={course.domaine}
                dateBegin={course.date_begin}
                dateEnd={course.date_end}
                name={course.name}
                description={course.description}
                handleCourseDelete={handleCourseDelete}
              />
            ))}
        </div>
        <div>
          {globalContext.errorMsg && (
            <ErrorMsg message={globalContext.msgContent} />
          )}
          {globalContext.succesMsg && (
            <SuccesMsg message={globalContext.msgContent} />
          )}
        </div>
      </div>
    </div>
  );
}

// UserProfileModel.propTypes = {
//   experiences: PropTypes.arrayOf(
//     PropTypes.shape({
//       id: PropTypes.number.isRequired,
//       company: PropTypes.string.isRequired,
//       title: PropTypes.string.isRequired,
//       type: PropTypes.string.isRequired,
//       city: PropTypes.string.isRequired,
//       date_begin: PropTypes.string.isRequired,
//       date_end: PropTypes.string.isRequired,
//       description: PropTypes.string.isRequired,
//     })
//   ),
//   courses: PropTypes.arrayOf(
//     PropTypes.shape({
//       id: PropTypes.number.isRequired,
//       level: PropTypes.string.isRequired,
//       domaine: PropTypes.string.isRequired,
//       date_begin: PropTypes.string.isRequired,
//       date_end: PropTypes.string.isRequired,
//       name: PropTypes.string.isRequired,
//       description: PropTypes.string.isRequired,
//     })
//   ),
// };

// UserProfileModel.defaultProps = {
//   experiences: [],
//   courses: [],
// };

export default UserProfileModel;
