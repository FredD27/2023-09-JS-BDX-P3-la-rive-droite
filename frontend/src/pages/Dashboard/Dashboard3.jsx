import React, { useState, useEffect } from "react";
import ButtonMini from "../../components/Boutons/ButtonMini";
import { useGlobalContext } from "../../contexts/GlobalContext";
import { useAdminContext } from "../../contexts/AdminContext";

function Dashboard3() {
  const { unauthorized, apiService } = useGlobalContext();
  const { goToEditUser } = useAdminContext();

  const { handleOffers } = useAdminContext();

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
        <ButtonMini textBtn="Tableau d'Offres" onClick={handleOffers} />
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
                  onClick={() => goToEditUser(user.id)}
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

export default Dashboard3;
