class LoginResponseSchma {
  constructor(
    id,
    username,
    email,
    password,
    role,
    status,
    created_at,
    updated_at
  ) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
    this.role = role;
    this.status = status;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}

module.exports = LoginResponseSchma;
