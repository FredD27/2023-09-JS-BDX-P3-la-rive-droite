const models = require("../models/index");

const getCoursesByCvId = async (req, res) => {
  try {
    const rows = await models.course.findAllByCvId(req.params.id);
    res.send(rows);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const getCourseById = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const [item] = await models.course.findId(id);
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

const postCourse = async (req, res) => {
  try {
    const rows = await models.course.create(req.body);
    res.send({
      id: rows.insertId,
      domaine: req.body.domaine,
      name: req.body.name,
    });
  } catch (err) {
    console.error(err);
    res.status(422).send({ error: err.message });
  }
};

const updateCourse = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (!id) {
      res.sendStatus(500);
    }

    const result = await models.course.update(id, req.body);
    if (result.affectedRows === 0) {
      res.sendStatus(500);
    }
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(422).send({ error: error.message });
  }
};

const deleteCourseById = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    const [result] = await models.course.deleteId(id);
    res.status(201).send({ message: result });
  } catch (err) {
    console.error(err);
    res.status(422).send({ message: "Course not found." });
  }
};

module.exports = {
  getCourseById,
  postCourse,
  updateCourse,
  deleteCourseById,
  getCoursesByCvId,
};
