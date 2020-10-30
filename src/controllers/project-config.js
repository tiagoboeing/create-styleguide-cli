const PROJECT_CONFIG_FILE = 'config.js'

/**
 * Get config file properties from template directory
 * @param {*} options CLI options
 * @returns {{ dependencies: {}, devDependencies: {}, files: String[] }}
 */
export function getProjectConfig (options) {
  const projectConfigs = require(`${options.templateDirectory}/${PROJECT_CONFIG_FILE}`)
  return projectConfigs
}
