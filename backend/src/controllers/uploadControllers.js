const models = require("../models");

const createUpload = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await models.upload.create(req.file);
    await models.user.updateUser(id, {
      upload_url: result.url,
    });
    return res.status(201).send({ avatar: result });
  } catch (err) {
    return res.status(400).send({ message: err.message });
  }
};

module.exports = { createUpload };
