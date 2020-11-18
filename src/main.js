import chalk from 'chalk'
import fs from 'fs'
import Listr from 'listr'
import ncp from 'ncp'
import path from 'path'
import { install, projectInstall } from 'pkg-install'
import { promisify } from 'util'
import { getProjectConfig } from './controllers/project-config'

import { fileURLToPath } from 'url'

const access = promisify(fs.access)
const copy = promisify(ncp)

async function copyTemplateFiles (options) {
  const templateDir = `${options.templateDirectory}/assets`
  return copy(templateDir, options.targetDirectory, {
    clobber: false
  })
}

async function installDependencies (options, projectConfigs) {
  const { devDependencies, dependencies } = projectConfigs

  async function add (deps, dev = true) {
    if (deps) {
      await install(deps, {
        dev
      })
    }
  }

  await add(dependencies, false)
  await add(devDependencies, true)

  await projectInstall({
    cwd: options.targetDirectory
  })
}

export async function configureProject (options) {
  options = {
    ...options,
    targetDirectory: options.targetDirectory || process.cwd()
  }

  const currentFileUrl = __dirname

  const templateDir = path.resolve(
    currentFileUrl,
    '../templates',
    options.project.toLowerCase()
  )

  options.templateDirectory = templateDir

  try {
    await access(`${templateDir}`, fs.constants.R_OK)
  } catch (err) {
    console.error('%s Invalid template name', chalk.red.bold('ERROR'))
    process.exit(1)
  }

  const tasks = new Listr([
    {
      title: 'Read project config file',
      task: ctx => {
        ctx.projectConfigs = getProjectConfig(options)
      }
    },
    {
      title: 'Install dependencies',
      task: ({ projectConfigs }) => installDependencies(options, projectConfigs)
    },
    {
      title: 'Copy template files',
      task: () => copyTemplateFiles(options)
    }
  ])

  await tasks.run()

  console.log('%s Project ready', chalk.green.bold('DONE'))
  return true
}
