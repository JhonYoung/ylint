// 检查是否存在相关配置，提示用户是否覆盖
// copy 配置到指定目录
// 安装依赖
// 修改package.json配置，husky的配置

import { Command } from '@oclif/command'
import {
  pathExists,
  remove,
  copySync,
  writeJsonSync,
  readJsonSync,
} from 'fs-extra'
import * as path from 'path'
import * as inquirer from 'inquirer'
import * as ora from 'ora'
import * as execa from 'execa'

const pathsToCheck = [
  `${path.resolve('./')}/.eslintrc`,
  `${path.resolve('./')}/.eslintrc.js`,
  `${path.resolve('./')}/.prettierrc.js`,
  `${path.resolve('./')}/.prettierrc`,
]

// 检查原本是否有配置文件
const checkConfigFile = async () => {
  const pro = Promise.all(
    pathsToCheck.map((path: string) => {
      return pathExists(path)
    }),
  )
  const res = await pro
  if (res.some((i) => i)) {
    return 'your project has eslintrc or prettierrc file exists, will you replace it ? Y/n'
  }
  return false
}

// 修改package.json, 并初始化husky配置
const modifyPackageJson = async () => {
  const packageObj = readJsonSync(`${path.resolve('./')}/package.json`)
  packageObj.scripts = {
    ...(packageObj.scripts || {}),
    prepare: 'husky install',
  }

  // 配置检查规则
  packageObj['lint-staged'] = {
    '*.{js,jsx,vue,tsx,ts,json}': [
      'prettier --write',
      'eslint --ext .vue,.js,.jsx,.tsx,.ts --fix',
      'git add',
    ],
  }
  writeJsonSync(`${path.resolve('./')}/package.json`, packageObj)

  // 初始化husky配置
  await execa.command('npm run prepare')
  copySync(
    `${__dirname}/config/pre-commit`,
    `${path.resolve('./')}/.husky/pre-commit`,
  )
  console.log('init success')
}

// 安装依赖
const installPackages = async () => {
  const spinner = ora({
    text: 'install eslint',
    color: 'yellow',
  }).start()

  await execa.command('npm i eslint@7.32.0 babel-eslint prettier --save-dev')

  spinner.text = 'install husky and lint-staged'
  await execa.command('npm i husky lint-staged --save-dev')

  spinner.text = 'install typescript and typescript-eslint'
  await execa.command('npm i typescript @typescript-eslint/parser --save-dev')

  spinner.text = 'install eslint plugins'
  await execa.command(
    'npm install --save-dev eslint-plugin-promise eslint-plugin-import eslint-plugin-node eslint-plugin-react eslint-plugin-prettier',
  )
  await execa.command('npm install eslint-config-standard@14.1.1 --save-dev')

  spinner.text = 'install npm packages success'
  spinner.color = 'green'

  console.log('install npm packages success')
  setTimeout(() => {
    spinner.stop()
  }, 1000)
  modifyPackageJson()
}

// 移除原本的eslintrc prettierrc文件，并copy当前配置
const copyConfig = async (removeFirst?: boolean) => {
  if (removeFirst) {
    const pro = Promise.all(
      pathsToCheck.map((path: string) => {
        return remove(path)
      }),
    )
    await pro
  }
  copySync(`${__dirname}/config`, path.resolve('./'))
  installPackages()
}

export class InitCommand extends Command {
  static description =
    'add pretter eslint husky lint-staged for git commit hook'

  async run() {
    const message = await checkConfigFile()
    if (message) {
      inquirer
        .prompt([
          {
            type: 'confirm',
            name: 'replace',
            message,
          },
        ])
        .then((res) => {
          if (res.replace) {
            copyConfig(true)
          } else {
            this.log('you choice not to replace')
          }
        })
      return
    }
    copyConfig()
  }
}
