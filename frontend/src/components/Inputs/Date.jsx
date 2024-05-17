import PropTypes from "prop-types";
import "./date.css";

function Date({ titleCalendar, fieldName, handleChange, value }) {
  return (
    <div className="container-date">
      <label className="label-champs-date" htmlFor="start">
        {titleCalendar ?? "Aucune valeur n'est renseignée."}
      </label>

      <input
        className="date-background"
        type="date"
        id="start"
        name={fieldName}
        onChange={handleChange}
        value={value}
      />
    </div>
  );
}

Date.propTypes = {
  titleCalendar: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  fieldName: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

export default Date;
