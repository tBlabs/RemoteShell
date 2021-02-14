// These two imports must go first!
import 'reflect-metadata';
import { Types } from './Types';
import { Container } from 'inversify';

import { ILogger } from './../services/logger/ILogger';
import { IRunMode } from './../services/runMode/IRunMode';
import { RunMode } from './../services/runMode/RunMode';
import { IEnvironment } from './../services/env/IEnvironment';
import { Environment } from './../services/env/Environment';
import { Logger } from '../services/logger/Logger';
import { ConsoleOutput } from "../services/logger/ConsoleOutput";
import { ILoggerOutput } from "../services/logger/ILoggerOutput";
import { Main } from '../Main';
import { IStartupArgs } from '../services/env/IStartupArgs';
import { StartupArgs } from '../services/env/StartupArgs';
import { Config } from '../services/config/Config';
import { IShell } from '../services/shell/IShell';
import { Shell } from '../services/shell/Shell';
import { ProcessesManager } from "../services/shell/ProcessesManager";
import { IConfig } from '../services/config/IConfig';
import { ProcessesList } from '../services/shell/ProcessesList';
import { ProcessBackgroundRunner } from '../services/shell/ProcessBackgroundRunner';

const IoC = new Container();

try
{
    IoC.bind<IEnvironment>(Types.IEnvironment).to(Environment).whenTargetIsDefault();
    IoC.bind<IRunMode>(Types.IRunMode).to(RunMode).whenTargetIsDefault();
    IoC.bind<ILoggerOutput>(Types.ILoggerOutput).to(ConsoleOutput).inSingletonScope().whenTargetIsDefault();
    IoC.bind<ILogger>(Types.ILogger).to(Logger).inSingletonScope().whenTargetIsDefault();
    IoC.bind<Main>(Main).toSelf().inSingletonScope().whenTargetIsDefault();
    IoC.bind(ProcessesManager).toSelf().inSingletonScope().whenTargetIsDefault();
    IoC.bind(ProcessesList).toSelf().inSingletonScope().whenTargetIsDefault();
    IoC.bind(ProcessBackgroundRunner).toSelf().inSingletonScope().whenTargetIsDefault();
    IoC.bind<IStartupArgs>(Types.IStartupArgs).to(StartupArgs).inSingletonScope().whenTargetIsDefault();
    IoC.bind<IConfig>(Types.IConfig).to(Config).inSingletonScope().whenTargetIsDefault();
    IoC.bind<IShell>(Types.IShell).to(Shell).inTransientScope().whenTargetIsDefault();
}
catch (ex)
{
    console.log('IoC exception:', ex);
}

export { IoC };
