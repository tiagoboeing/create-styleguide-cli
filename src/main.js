import chalk from 'chalk'
import fs from 'fs'
import { Listr } from 'listr2'
import ncp from 'ncp'
import path from 'path'
import { install, projectInstall } from 'pkg-install'
import { promisify } from 'util'
import { verifyFilesExists } from './cli'
import { getProjectConfig } from './controllers/project-config'

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

  const currentFileUrl = new URL(import.meta.url).pathname
  const templateDir = path.resolve(
    currentFileUrl.substr(currentFileUrl.indexOf('/')),
    '../../templates',
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
      task: ctx => (ctx.projectConfigs = getProjectConfig(options)),
      skip: ctx => ctx.skipPrompts
    },
    {
      title: 'Verify existing config files',
      task: async (ctx, task) => {
        console.log(ctx)
        await verifyFilesExists(options, ctx, task)
      },
      skip: ctx => ctx.skipPrompts
    },
    {
      title: 'Verify existing config files',
      task: (ctx, task) => {
        console.log(ctx)
      },
      skip: ctx => ctx.skipPrompts
    },
    {
      title: 'Install dependencies',
      task: ({ projectConfigs }) => installDependencies(options, projectConfigs),
      skip: ctx => ctx.skipPrompts
    },
    {
      title: 'Copy template files',
      task: () => copyTemplateFiles(options),
      skip: ctx => ctx.skipPrompts
    }
  ])

  await tasks.run()

  console.log('%s Project ready', chalk.green.bold('DONE'))
  return true
}
