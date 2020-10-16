const PROJECT_CONFIG_FILE = 'config.js'

export function getProjectConfig (options) {
  const projectConfigs = require(`${options.templateDirectory}/${PROJECT_CONFIG_FILE}`)
  return projectConfigs
}
