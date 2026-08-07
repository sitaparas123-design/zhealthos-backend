module.exports = {
  accessSecret: process.env.JWT_ACCESS_SECRET || 'zhealthos_super_secret_access_key_2026',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'zhealthos_super_secret_refresh_key_2026',
  accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '7d',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
}
