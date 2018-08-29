import './loadenv';
import appConfig from './app';
import ethereumConfig from './ethereum';
import databaseConfig from './database';

export default Object.assign({}, appConfig, ethereumConfig, databaseConfig);

