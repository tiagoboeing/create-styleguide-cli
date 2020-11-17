import arg from 'arg'
import inquirer from 'inquirer'
import path from 'path'
import fs from 'fs'
import { configureProject } from './main'
import { getProjectConfig } from './controllers/project-config'

function parseArgumentsIntoOptions (rawArgs) {
  const args = arg(
    {
      '--project': String,
      '--yes': Boolean
    },
    {
      argv: rawArgs.slice(2)
    }
  )

  return {
    project: args['--project'],
    skipPrompts: args['--yes'] || false
  }
}

/**
 * Verify if files listed on `files` property on config.js exists in project root
 * @param {*} options CLI options
 * @param {*} ctx context from Listr
 * @returns {Promise<{exists: Boolean, conflictedFiles: Array}>}
 */
export function verifyFilesExists (options, ctx) {
  const { files } = ctx.projectConfigs
  const props = {
    exists: false,
    conflictedFiles: []
  }

  for (const index in files) {
    if (!fs.existsSync(files[index])) {
      continue
    }
    props.exists = true
    props.conflictedFiles.push(files[index])
  }

  return {
    ...options,
    ...props
  }
}

async function promptForMissingOptions (options) {
  const defaultProject = 'Angular 2+'

  if (options.skipPrompts) {
    return {
      ...options,
      template: options.project || defaultProject
    }
  }

  const questions = []
  if (!options.project) {
    questions.push({
      type: 'list',
      name: 'project',
      message: 'What the type of your project?',
      choices: [
        {
          name: 'JavaScript',
          value: 'javascript'
        },
        {
          name: 'Angular 2+',
          value: 'angular2'
        },
        {
          name: 'React / Next.js (TypeScript)',
          value: 'react-next-ts'
        }
      ]
    })
  }

  const answers = await inquirer.prompt(questions)

  return {
    ...options,
    project: options.project || answers.project
  }
}

export async function cli (args) {
  let options = parseArgumentsIntoOptions(args)
  options = await promptForMissingOptions(options)

  await configureProject(options)
}
