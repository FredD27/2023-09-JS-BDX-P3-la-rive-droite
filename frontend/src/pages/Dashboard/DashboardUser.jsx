import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ButtonMini from "../../components/Boutons/ButtonMini";
import { useGlobalContext } from "../../contexts/GlobalContext";

function DashboardUser() {
  const navigate = useNavigate();
  const { unauthorized, apiService } = useGlobalContext();

  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const response = await apiService.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/users`
      );
      setUsers(response.data);
      // console.log(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteUser = async (id) => {
    // eslint-disable-next-line no-alert
    if (!window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) {
      return;
    }
    try {
      await apiService.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${id}`
      );
      setUsers((previousOffer) =>
        previousOffer.filter((user) => user.id !== id)
      );
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
    unauthorized();
  }, []);

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-5">
        <h2 className="tab">Tableau de bord</h2>
        <ButtonMini
          textBtn="Tableau d'Offres"
          onClick={() => {
            navigate("/dashboard/offer");
          }}
        />
      </div>
      <h4>Utilisateurs</h4>
      <table className="table mb-5">
        <thead>
          <tr>
            {["ID", "Nom", "Prénom", "Tel", "Email", "Admin", "Actions"].map(
              (element) => (
                <td key={element}>{element}</td>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.lastname}</td>
              <td>{user.firstname}</td>
              <td>{user.phone}</td>
              <td>{user.email}</td>
              <td>{user.is_admin ? "Oui" : "Non"}</td>
              <td>
                <button
                  type="button"
                  aria-label="editeuser"
                  onClick={() => navigate(`/dashboard/edit-user/${user.id}`)}
                  className="invisible-button mx-2"
                >
                  <i className="fa-solid fa-pen" />
                </button>
                <button
                  type="button"
                  aria-label="deleteuser"
                  onClick={() => deleteUser(user.id)}
                  className="invisible-button mx-2"
                >
                  <i className="fa-solid fa-trash" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DashboardUser;
