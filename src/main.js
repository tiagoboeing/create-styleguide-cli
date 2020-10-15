import chalk from 'chalk'
import fs from 'fs'
import Listr from 'listr'
import ncp from 'ncp'
import path from 'path'
import { install, projectInstall } from 'pkg-install'
import { promisify } from 'util'

const access = promisify(fs.access)
const copy = promisify(ncp)

async function copyTemplateFiles (options) {
  return copy(options.templateDirectory, options.targetDirectory, {
    clobber: false
  })
}

async function installDependencies (options) {
  await install(
    {
      eslint: undefined,
      'eslint-config-prettier': undefined,
      'eslint-config-standard': undefined,
      'eslint-plugin-import': undefined,
      'eslint-plugin-node': undefined,
      'eslint-plugin-prettier': undefined,
      'eslint-plugin-promise': undefined,
      'eslint-plugin-standard': undefined,
      '@typescript-eslint/eslint-plugin': undefined,
      '@typescript-eslint/parser': undefined
    },
    {
      dev: true
    }
  )

  await projectInstall({
    cwd: options.targetDirectory
  })
}

export async function configureProject (options) {
  options = {
    ...options,
    targetDirectory: options.targetDirectory || process.cwd()
  }

  const currentFileUrl = import.meta.url
  const templateDir = path.resolve(
    new URL(currentFileUrl).pathname,
    '../../templates',
    options.project.toLowerCase(),
    'assets'
  )
  options.templateDirectory = templateDir

  try {
    await access(templateDir, fs.constants.R_OK)
  } catch (err) {
    console.error('%s Invalid template name', chalk.red.bold('ERROR'))
    process.exit(1)
  }

  const tasks = new Listr([
    {
      title: 'Install dependencies',
      task: () => installDependencies(options)
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
