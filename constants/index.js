exports.RUNNING_ENVIRONMENTS = Object.freeze({
  DEVELOPMENT: "development",
  PRODUCTION: "production",
});
exports.ROLES = Object.freeze({
  SUPER_ADMIN: "S.Admin",
  ADMIN: "Admin",
  MANAGER: "Manager",
  INSTRUCTOR: "Instructor",
  STUDENT: "Student",
  CUSTOM: "Custom",
});

exports.TABLES = Object.freeze({
  USER: "user",
  TEST: "test",
});

/**
 * The Following will be used in permissions map which will be assigned to a role.
 * These also need to be sent to ffrontend for checking a permission for a user
 */
exports.ACTIONS = Object.freeze({
  ADD_A_USER: "add_a_user",
});
