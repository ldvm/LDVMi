import createPrefixer from '../../../../../misc/createPrefixer'
import { MODULE_PREFIX as PARENT_MODULE_PREFIX } from '../../prefix'

export const MODULE_PREFIX = PARENT_MODULE_PREFIX + '-' + 'things-things-instants';
export default createPrefixer(MODULE_PREFIX);
