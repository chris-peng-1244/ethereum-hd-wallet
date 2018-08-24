import 'dotenv';

import appConfig from './app';
import ethereumConfig from './ethereum';

export default Object.assign({}, appConfig, ethereumConfig);

