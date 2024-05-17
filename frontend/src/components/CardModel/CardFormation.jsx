import "./card-model.css";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

import PropTypes from "prop-types";

function CardFormation({
  id,
  domaine,
  dateBegin,
  dateEnd,
  name,
  level,
  description,
  handleCourseDelete,
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
              handleCourseDelete(id);
            }}
          >
            <i className="fa-solid fa-trash-can" />
          </button>
          <button
            className="invisible-button"
            aria-label="toggleFavorite"
            type="button"
            onClick={() => {
              navigate(`/profile/formation/edit/${id}`);
            }}
          >
            <i className="fa-solid  fa-pen-nib" />
          </button>
        </div>
      </div>
      <h4 className="date-poste">
        {formattedDateBegin} au {formattedDateEnd}
      </h4>
      <h3 className="label-offre ">
        {level} {domaine}
      </h3>
      <p className="entreprise-champs formation ">{name}</p>
      <p className="p-description ">{trimText(description, 250)}</p>
    </div>
  );
}
CardFormation.propTypes = {
  id: PropTypes.number.isRequired,
  domaine: PropTypes.string.isRequired,
  dateBegin: PropTypes.string.isRequired,
  dateEnd: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  level: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  handleCourseDelete: PropTypes.func.isRequired,
};

export default CardFormation;
