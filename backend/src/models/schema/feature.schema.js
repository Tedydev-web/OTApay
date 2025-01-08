class FeatureSchema {
  constructor(id, name, description, platform, status, created_at, updated_at) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.platform = platform;
    this.status = status;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}

module.exports = FeatureSchema;
