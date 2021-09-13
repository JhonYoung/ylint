import {Command} from '@oclif/command'
import {pathExists, remove, copySync} from 'fs-extra';
import * as path from 'path'
import * as inquirer from 'inquirer';

const pathsToCheck = [`${path.resolve('./')}/.eslintrc`, `${path.resolve('./')}/.eslintrc.js`, `${path.resolve('./')}/.prettierrc.js`, `${path.resolve('./')}/.prettierrc`] 

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

// 移除原本的eslintrc prettierrc文件，并copy当前配置
const copyConfig = async (removeFirst?: boolean) => {
  if (removeFirst) {
    const pro = Promise.all(pathsToCheck.map((path: string) => {
      return remove(path)
    }))
    await pro;
  }
  
  copySync('../config/*', path.resolve('./'))
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
        console.log('res=============>', res)
        copyConfig(true);
      })

      copyConfig();

    }
  }
}