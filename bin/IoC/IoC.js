"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IoC = void 0;
// These two imports must go first!
require("reflect-metadata");
const Types_1 = require("./Types");
const inversify_1 = require("inversify");
const RunMode_1 = require("./../services/runMode/RunMode");
const Environment_1 = require("./../services/env/Environment");
const Logger_1 = require("../services/logger/Logger");
const ConsoleOutput_1 = require("../services/logger/ConsoleOutput");
const Main_1 = require("../Main");
const StartupArgs_1 = require("../services/env/StartupArgs");
const Config_1 = require("../services/config/Config");
const Shell_1 = require("../services/shell/Shell");
const IoC = new inversify_1.Container();
exports.IoC = IoC;
try {
    IoC.bind(Types_1.Types.IEnvironment).to(Environment_1.Environment).whenTargetIsDefault();
    IoC.bind(Types_1.Types.IRunMode).to(RunMode_1.RunMode).whenTargetIsDefault();
    IoC.bind(Types_1.Types.ILoggerOutput).to(ConsoleOutput_1.ConsoleOutput).inSingletonScope().whenTargetIsDefault();
    IoC.bind(Types_1.Types.ILogger).to(Logger_1.Logger).inSingletonScope().whenTargetIsDefault();
    IoC.bind(Main_1.Main).toSelf().inSingletonScope().whenTargetIsDefault();
    IoC.bind(Types_1.Types.IStartupArgs).to(StartupArgs_1.StartupArgs).inSingletonScope().whenTargetIsDefault();
    IoC.bind(Types_1.Types.IConfig).to(Config_1.Config).inSingletonScope().whenTargetIsDefault();
    IoC.bind(Types_1.Types.IShell).to(Shell_1.Shell).inTransientScope().whenTargetIsDefault();
}
catch (ex) {
    console.log('IoC exception:', ex);
}
//# sourceMappingURL=IoC.js.map