import {Command} from '@oclif/command'
import {pathExists, remove, copySync, readJsonSync} from 'fs-extra';
import * as path from 'path'
import * as inquirer from 'inquirer';
import * as ora from 'ora';
import * as execa from 'execa';

const pathsToCheck = [`${path.resolve('./')}/.eslintrc`, `${path.resolve('./')}/.eslintrc.js`, `${path.resolve('./')}/.prettierrc.js`, `${path.resolve('./')}/.prettierrc`] 

// 检查原本是否有配置文件
const checkConfigFile = async () => {
  const pro = Promise.all(pathsToCheck.map((path: string) => {
    return pathExists(path)
  }))
  const res = await pro;
  if (res.some(i => i)) {
    return 'your project has eslintrc or prettierrc file exists, will you replace it ? Y/n';
  }
  return false
}


const installPackages = async () => {
  const spinner = ora({
    text: 'install eslint',
    spinner: 'moon',
    color: 'yellow'
  }).start();
 
  await execa.command('npm i eslint --save-dev')

  spinner.text = 'install prettier';
  await execa.command('npm i prettier --save-dev')

  spinner.text = 'install babel-eslint';
  await execa.command('npm i babel-eslint --save-dev')

  spinner.text = 'install eslint-plugin-prettier';
  await execa.command('npm i eslint-plugin-prettier --save-dev')

  spinner.text = 'install husky';
  await execa.command('npm i husky --save-dev')

  spinner.text = 'install lint-staged';
  await execa.command('npm i lint-staged --save-dev')

  spinner.text = 'install standard';
  await execa.command('npm i standard --save-dev')

  spinner.text = 'install typescript';
  await execa.command('npm i typescript --save-dev')

  spinner.text = 'install @typescript-eslint/parser';
  await execa.command('npm i @typescript-eslint/parser --save-dev')

  spinner.text = 'install @typescript-eslint/eslint-plugin';
  await execa.command('npm i @typescript-eslint/eslint-plugin --save-dev')
  
  console.log('install success');
  spinner.color = 'green';
  setTimeout(() => {
    spinner.stop();
  }, 1000)

  // execa('npm i eslint babel-eslint prettier eslint-plugin-prettier eslint-config-prettier husky lint-staged standard typescript @typescript-eslint/parser @typescript-eslint/eslint-plugin --save-dev')
}


// 修改package.json
const modifyPackageJson = () => {
  console.log('===============================')
  const packageObj = readJsonSync(`${path.resolve('./')}/package.json`)
  console.log(packageObj)
  console.log('++++++++++++++++++')
  console.log('++++++++++++++++++')
  console.log('++++++++++++++++++')
}

// 移除原本的eslintrc prettierrc文件，并copy当前配置
const copyConfig = async (config?: any,removeFirst?: boolean) => {
  if (removeFirst) {
    const pro = Promise.all(pathsToCheck.map((path: string) => {
      return remove(path)
    }))
    await pro;
  }
  // console.log('dirname=======>', __dirname)
  copySync(`${__dirname}/config`, path.resolve('./'))

  // modifyPackageJson();
  installPackages();
}




export class InitCommand extends Command {
  static description = 'add pretter eslint husky lint-staged for git commit hook'
  async run() {
    const message = await checkConfigFile();
    if (message) {
      inquirer.prompt([
        {
          type: 'confirm',
          name: 'replace',
          message
        }
      ]).then(res => {
        if (res.replace) {
          copyConfig(this.config, true);
        } else {
          this.log('you choice not to replace, exist the process');
        }
      })
      return;
    }
    copyConfig(this.config);
  }
}