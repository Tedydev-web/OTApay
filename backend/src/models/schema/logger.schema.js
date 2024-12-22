class LoggerSchema {
  constructor(
    id,
    timestamp,
    method,
    user_id,
    level,
    ip_address,
    url,
    user_agent,
    status_code,
    message,
    error_message,
    metadata,
    context,
    file_name,
    line_number,
    stack_trace
  ) {
    this.id = id;
    this.timestamp = timestamp;
    this.method = method;
    this.user_id = user_id;
    this.level = level;
    this.ip_address = ip_address;
    this.url = url;
    this.user_agent = user_agent;
    this.status_code = status_code;
    this.message = message;
    this.error_message = error_message;
    this.metadata = metadata;
    this.context = context;
    this.file_name = file_name;
    this.line_number = line_number;
    this.stack_trace = stack_trace;
  }
}

module.exports = LoggerSchema;
