const PROJECT_CONFIG_FILE = 'config.js'

export function getProjectConfig (options) {
  console.log(options)
  const projectConfigs = require(`${options.templateDirectory}/${PROJECT_CONFIG_FILE}`)
  return projectConfigs
}
