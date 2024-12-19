class PrioritySchema {
  constructor({ name, des, level, is_deleted, created_at, updated_at }) {
    this.name = name;
    this.des = des;
    this.level = level;
    this.is_deleted = is_deleted;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}

module.exports = PrioritySchema;
