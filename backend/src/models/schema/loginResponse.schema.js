class LoginResponseSchma {
  constructor(
    id,
    username,
    email,
    is_verify,
    role,
    status,
    created_at,
    updated_at
  ) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.is_verify = is_verify;
    this.role = role;
    this.status = status;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}

module.exports = LoginResponseSchma;
