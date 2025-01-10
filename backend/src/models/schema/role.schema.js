class RoleSchema {
  constructor(id, name, guard_name, status, created_at, updated_at) {
    this.id = id;
    this.name = name;
    this.guard_name = guard_name;
    this.status = status;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}

module.exports = RoleSchema;
