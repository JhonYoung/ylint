import {Command} from '@oclif/command'
export class GoodbyeCommand extends Command {
  static description = 'test add new command'
  async run() {
    console.log('goodbye, world!')
    this.log('log')
    this.warn('warn!')
    this.error('error')
  }
}