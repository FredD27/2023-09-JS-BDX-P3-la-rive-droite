const jwt = require("jsonwebtoken");
const models = require("../models/index");

function generateAccessToken(data) {
  return jwt.sign(data, process.env.APP_SECRET);
}

const getUsers = async (_, res) => {
  try {
    const rows = await models.user.findAll();
    res.send(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err.message });
  }
};

const setSkills = async (req, res) => {
  const id = +req.params.id;

  try {
    await models.userCompetence.setUserCompetencesList(id, req.body);
    return res.status(201).send({});
  } catch (err) {
    console.error(err);
    return res.status(400).send({ error: err.message });
  }
};

const getUserById = async (req, res) => {
  const id = +req.params.id;

  if (req.user.id !== id && !req.user.is_admin) {
    return res.status(403).send({ error: "You do not have permission" });
  }

  try {
    const [result] = await models.user.findId(id);
    if (!result.length) {
      return res.status(404).send({ error: "User not found" });
    }
    const user = result[0];
    delete user.password;
    user.competences = await models.userCompetence.getUserCompetences(user.id);
    return res.send(user);
  } catch (error) {
    return res.status(422).send({ error: error.message });
  }
};

const postUser = async (req, res) => {
  try {
    const { rows } = await models.user.create(req.body);
    res.status(201).send({
      insertId: rows.insertId,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      phone: req.body.phone,
      address: req.body.address,
      email: req.body.email,
      is_admin: req.body.is_admin,
      competenceId: rows.competenceId,
    });
  } catch (err) {
    console.error(err);
    res.status(422).send({ error: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const id = +req.params.id;

    if (req.user.id !== id && !req.user.is_admin) {
      return res.status(403).send({ error: "You do not have permission" });
    }

    let result = await models.user.update(id, req.body);
    if (result.affectedRows.length === 0) {
      return res.status(404);
    }
    [result] = await models.user.findId(id);
    const user = result[0];
    delete user.password;

    return res.send(user);
  } catch (err) {
    console.error(err);
    return res.status(422).send({ error: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = +req.params.id;

    await models.user.deleteId(userId);
    res.status(201).json({ message: "Utilisateur supprimé." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "User not found ..." });
  }
};

const postLogin = async (req, res) => {
  try {
    const user = await models.user.login(req.body);
    if (user) {
      const token = generateAccessToken(user);
      res.send({ token });
    } else {
      res.status(401).send({ error: "Identifiant incorrect!!!" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err.message });
  }
};

// const updateUser = async (req, res) => {
//   try {
//     const id = parseInt(req.params.id, 10);
//     if (!id) {
//       res.sendStatus(500);
//     }
//     const result = await models.user.updateUser(id, req.body);
//     if (result.affectedRows.length === 0) {
//       res.sendStatus(500);
//     }
//     res.sendStatus(200);
//   } catch (error) {
//     console.error(error);
//     res.status(422).send({ error: error.message });
//   }
// };

const getProfile = async (req, res) => {
  delete req.user.password;
  req.user.competences = await models.userCompetence.getUserCompetences(
    req.user.id
  );
  res.send(req.user);
};

const getMatchingOffers = async (req, res) => {
  // 1) Récupérer les compétences de l'utilisateur actuel
  // 2) Récupérer les offres qui correspondent à ces compétences
  // 3) Récupérer TOUTES les compétences des offres trouvées
  try {
    // userCompetences contient les compétences de l'utilisateur actuel
    const userCompetences = await models.userCompetence.getUserCompetences(
      req.user.id
    );

    // userCompetencesIds contient les IDs des compétences de l'utilisateur actuel
    const userCompetencesIds = userCompetences.map((competence) => {
      return competence.id;
    });

    // matchingOffers contient les offres qui correspondent aux compétences de l'utilisateur actuel
    const matchingOffers = await models.offer.getOffersByCompetenceIds(
      userCompetencesIds
    );

    // matchingOfferIds contient les IDs des offres qui correspondent aux compétences de l'utilisateur actuel
    const matchingOfferIds = matchingOffers.map((offer) => {
      return offer.id;
    });

    // matchingOffersCompetences contient les compétences des offres qui correspondent aux compétences de l'utilisateur actuel
    const matchingOffersCompetences =
      await models.offerCompetence.getOfferCompetencesByOfferIds(
        matchingOfferIds
      );

    // console.log(userCompetences);
    // console.log(matchingOffers);
    // console.log(matchingOffersCompetences);

    // associer les offres et les compétences
    const offers = matchingOffers.map((offer) => {
      const offerCompetences = matchingOffersCompetences.filter(
        (offerCompetence) => offerCompetence.offer_id === offer.id
      );
      return { ...offer, competences: offerCompetences };
    });

    let offersWithMatchingCompetences = offers.map((offer) => {
      const matchingCompetences = offer.competences.filter((competence) =>
        userCompetencesIds.includes(competence.id)
      );
      return { ...offer, matchingCompetences };
    });

    // inclure le pourcentage de match, arrondi à l'entier
    offersWithMatchingCompetences = offersWithMatchingCompetences.map(
      (offer) => {
        const modifiedOffer = { ...offer };
        modifiedOffer.matchingCompetencesRatio = Math.round(
          (modifiedOffer.matchingCompetences.length /
            modifiedOffer.competences.length) *
            100
        );
        return modifiedOffer;
      }
    );

    // trier les offres par pourcentage de match décroissant
    offersWithMatchingCompetences.sort((a, b) => {
      if (a.matchingCompetencesRatio > b.matchingCompetencesRatio) {
        return -1;
      }
      if (a.matchingCompetencesRatio < b.matchingCompetencesRatio) {
        return 1;
      }
      return 0;
    });

    res.send(offersWithMatchingCompetences);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

module.exports = {
  getUsers,
  postUser,
  postLogin,
  updateUser,
  deleteUser,
  getProfile,
  getUserById,
  setSkills,
  getMatchingOffers,
};
