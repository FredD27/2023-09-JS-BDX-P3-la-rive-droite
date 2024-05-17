import PropTypes from "prop-types";
import { format } from "date-fns";

import "./card-model.css";
import { useNavigate } from "react-router-dom";

function CardExperience({
  id,
  title,
  company,
  type,
  city,
  isWorking,
  dateBegin,
  dateEnd,
  description,
  handleExperienceDelete,
}) {
  const trimText = (chaine, limite) => {
    if (chaine.length <= limite) {
      return chaine;
    }
    return `${chaine.slice(0, limite)}...`;
  };
  const navigate = useNavigate();

  const dateBeginObject = new Date(dateBegin);
  const dateEndObject = new Date(dateEnd);

  const formattedDateBegin = format(dateBeginObject, "dd/MM/yyyy");
  const formattedDateEnd = format(dateEndObject, "dd/MM/yyyy");
  return (
    <div className="card-container">
      <div className="card-icons">
        <div className="icon-view">
          <button
            className="invisible-button"
            aria-label="toggleFavorite"
            type="button"
            onClick={() => {
              handleExperienceDelete(id);
            }}
          >
            <i className="fa-solid fa-trash-can" />
          </button>
          <button
            className="invisible-button"
            aria-label="toggleFavorite"
            type="button"
            onClick={() => {
              navigate(`/profile/experience/edit/${id}`);
            }}
          >
            <i className="fa-solid  fa-pen-nib" />
          </button>
        </div>
      </div>
      <h4 className="date-poste">
        {isWorking
          ? `Depuis le ${formattedDateBegin}`
          : `Du ${formattedDateBegin} au ${formattedDateEnd}`}
      </h4>
      <h3 className="label-offre">{title}</h3>
      <h4 className="entreprise-champs experience">
        {company} {city}
      </h4>
      <h5 className="poste-champs experience">
        {type} - {city}
      </h5>
      <p className="p-description ">{trimText(description, 250)}</p>
    </div>
  );
}

CardExperience.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  company: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  city: PropTypes.string.isRequired,
  isWorking: PropTypes.bool.isRequired,
  dateBegin: PropTypes.string.isRequired,
  dateEnd: PropTypes.string,
  description: PropTypes.string.isRequired,
  handleExperienceDelete: PropTypes.func.isRequired,
};

CardExperience.defaultProps = {
  dateEnd: null,
};

export default CardExperience;
