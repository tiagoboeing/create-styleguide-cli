import arg from 'arg'
import inquirer from 'inquirer'
import { configureProject } from './main'

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

async function promptForMissingOptions (options) {
  const defaultProject = 'angular2'
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
        { name: 'JavaScript', value: 'javascript' },
        { name: 'Angular 2+', value: 'angular2' },
        { name: 'React / Next.js (TypeScript)', value: 'react-next-ts' }
      ]
    })
  }

  const answers = await inquirer.prompt(questions)

  return {
    ...options,
    project: answers.project || options.project
  }
}

export async function cli (args) {
  let options = parseArgumentsIntoOptions(args)
  options = await promptForMissingOptions(options)

  await configureProject(options)
}
