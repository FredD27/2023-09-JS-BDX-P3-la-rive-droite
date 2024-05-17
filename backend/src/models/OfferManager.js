const AbstractManager = require("./AbstractManager");

class OfferManager extends AbstractManager {
  constructor() {
    super({ table: "offer" });
  }

  create(offer) {
    return this.database.query(
      `INSERT INTO ${this.table} (title, company, type, city, mission, search_profile, work_place, salary, info, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        offer.title,
        offer.company,
        offer.type,
        offer.city,
        offer.mission,
        offer.search_profile,
        offer.work_place,
        offer.salary,
        offer.info,
        offer.email,
      ]
    );
  }

  update(offer) {
    return this.database.query(
      `UPDATE ${this.table} SET title = ?, company = ?, type = ?, city = ?, mission = ?, search_profile = ?, work_place = ?, salary = ?, info = ?, email = ? WHERE id = ?`,
      [
        offer.title,
        offer.company,
        offer.type,
        offer.city,
        offer.mission,
        offer.search_profile,
        offer.work_place,
        offer.salary,
        offer.info,
        offer.email,
        offer.id,
      ]
    );
  }

  async getOffersByCompetenceIds(competenceIds) {
    const [result] = await this.database.query(
      `SELECT DISTINCT offer.* FROM ${this.table} 
      INNER JOIN offer_competence ON offer.id = offer_competence.offer_id 
      WHERE offer_competence.competence_id IN (?)`,
      [competenceIds]
    );

    return result;
  }

  async deleteId(id) {
    await this.database.query(
      `DELETE FROM offer_competence WHERE offer_id = ?`,
      [id]
    );
    return this.database.query(`DELETE FROM ${this.table} WHERE id = ?`, [id]);
  }
}

module.exports = OfferManager;
