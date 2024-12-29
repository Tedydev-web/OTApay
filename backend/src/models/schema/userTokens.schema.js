class UserTokensSchema {
    constructor(id, user_id, token, status,token_type, expires_at, created_at, updated_at) {
      this.id = id;
      this.user_id = user_id;
      this.token = token;
      this.status = status;
      this.token_type = token_type;
      this.expires_at = expires_at;
      this.created_at = created_at;
      this.updated_at = updated_at;
    }
  }
  module.exports = UserTokensSchema;