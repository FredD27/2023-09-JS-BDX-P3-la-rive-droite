const AbstractManager = require("./AbstractManager");

class CourseManager extends AbstractManager {
  constructor() {
    super({ table: "course" });
  }

  async create(course) {
    try {
      const [res] = await this.database.query(
        `INSERT INTO ${this.table} (level, domaine, name, date_begin, date_end, description, cv_id) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          course.level,
          course.domaine,
          course.name,
          course.dateBegin,
          course.dateEnd,
          course.description,
          course.cvId,
        ]
      );

      return res;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async update(id, course) {
    const { level, domaine, name, dateBegin, dateEnd, description } = course;

    try {
      const [result] = await this.database.query(
        `UPDATE ${this.table} SET level = ?, domaine = ?, name = ?, date_begin = ?, date_end = ?, description = ? WHERE id = ?`,
        [level, domaine, name, dateBegin, dateEnd, description, id]
      );

      return result;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async findAllByCvId(cvId) {
    try {
      const [results] = await this.database.query(
        `SELECT * FROM ${this.table} WHERE cv_id = ?`,
        [cvId]
      );
      return results;
    } catch (err) {
      console.error(err);
      return null;
    }
  }
}

module.exports = CourseManager;
