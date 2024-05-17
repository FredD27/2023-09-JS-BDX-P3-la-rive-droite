const AbstractManager = require("./AbstractManager");

class OfferCompetenceManager extends AbstractManager {
  constructor() {
    super({ table: "offer_competence" });
  }

  async addOfferCompetences(offerId, body) {
    const uniqValues = new Set(body.competences ?? []);

    const [offerCompetences] = await this.database.query(
      `SELECT competence_id from ${this.table} where offer_id = ?`,
      [offerId]
    );

    offerCompetences.forEach((offerCompetence) => {
      if (uniqValues.has(offerCompetence.competence_id)) {
        uniqValues.delete(offerCompetence.competence_id);
      }
    });
    if (!uniqValues.size) {
      return [];
    }

    const sqlValues = [];
    let sql = `insert into ${this.table} (offer_id, competence_id) VALUES`;

    [...uniqValues.values()].forEach((competenceId) => {
      sql += `${sqlValues.length > 0 ? "," : ""} (?,?)`;
      sqlValues.push(offerId);
      sqlValues.push(competenceId);
    });

    const [result] = await this.database.query(sql, sqlValues);
    return result;
  }

  async getOfferCompetences(offerId) {
    const [result] = await this.database.query(
      `SELECT competence.* FROM competence LEFT JOIN ${this.table} ON 
      competence.id = ${this.table}.competence_id WHERE ${this.table}.offer_id = ?`,
      offerId
    );

    return result;
  }

  async getOfferCompetencesByOfferIds(offerIds) {
    const [result] = await this.database.query(
      `SELECT ${this.table}.*, competence.* FROM ${this.table} 
      INNER JOIN competence ON competence.id = ${this.table}.competence_id WHERE offer_id IN (?)`,
      [offerIds]
    );

    return result;
  }
}

module.exports = OfferCompetenceManager;
