/**
 * Created by G on 02.10.2018.
 */
function CCliApp(app) {
  this.commanderApp = app;
  this.runCliInstance();
}

CCliApp.prototype.runCliInstance = function(){
  const self = this;
  self.commanderApp
    .command('command [command] [options]')
    .action(self.mapArgumentsToCommands)
    .option('-y, --forced', 'Run in forced mode');
  self.commanderApp.parse(process.argv);
};
CCliApp.prototype.mapArgumentsToCommands = function(command, options, commander) {
  const forced = (commander.hasOwnProperty('forced')) ? commander.forced : false;
  try {
    const _command = require('./commands/' + command + 'Command')[command + 'Command'];
    const commandClass = new _command(forced);
    console.log(commandClass);
    commandClass[options]();
    return true;
  } catch (e) {
    console.log('CLI error: ', e);
    return false;
  }
  return true;
};

module.exports = CCliApp;