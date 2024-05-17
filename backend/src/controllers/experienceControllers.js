// const jwt = require("jsonwebtoken");
const models = require("../models/index");

// function generateAccessToken(data) {
//   return jwt.sign(data, process.env.APP_SECRET);
// }

const getExperiencesByCvId = async (req, res) => {
  try {
    const rows = await models.experience.findAllByCvId(req.params.id);
    res.send(rows);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const getExperienceById = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const [item] = await models.experience.findId(id);
    if (item[0] != null) {
      res.json(item[0]);
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    console.error(err);
    res.sendStatus(422);
  }
};

const postExperience = async (req, res) => {
  try {
    const rows = await models.experience.create(req.body);
    res.send({
      id: rows.insertId,
    });
  } catch (err) {
    console.error(err);
    res.status(422).send({ error: err.message });
  }
};

const updateExperience = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (!id) {
      res.sendStatus(500);
    }

    const result = await models.experience.update(id, req.body);
    if (result.affectedRows === 0) {
      res.sendStatus(500);
    }
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(422).send({ error: error.message });
  }
};

const deleteExperienceById = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    const [result] = await models.experience.deleteId(id);
    res.status(201).send({ message: result });
  } catch (err) {
    console.error(err);
    res.status(422).send({ message: "Experience not found." });
  }
};

module.exports = {
  getExperienceById,
  postExperience,
  updateExperience,
  deleteExperienceById,
  getExperiencesByCvId,
};
