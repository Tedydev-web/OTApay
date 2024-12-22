class UserSchema {
  constructor(
    id,
    username,
    email,
    password,
    verify_token,
    expired_time,
    is_verify,
    role,
    status,
    created_at,
    updated_at
  ) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
    this.verify_token = verify_token;
    this.expired_time = expired_time;
    this.is_verify = is_verify;
    this.role = role;
    this.status = status;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}
module.exports = UserSchema;
