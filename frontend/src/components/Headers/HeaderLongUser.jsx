import "./header.css";

function HeaderLongUser() {
  return (
    <header className="header with-round-bottom">
      <nav>
        <i className="fa-solid fa-arrow-left" />
        <i className="fa-solid fa-bars" />
      </nav>
      <div className="header-content user">
        <div className="profile-img-container">
          <img src="/src/assets/no-profile.jpg" alt="" />
        </div>
        <button type="button">Modifier</button>
        <h1>Nom Prénom</h1>
      </div>
    </header>
  );
}

export default HeaderLongUser;
