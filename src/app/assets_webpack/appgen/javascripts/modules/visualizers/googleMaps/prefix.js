import createPrefixer from '../../../misc/createPrefixer'
import { name } from './definition'

export const MODULE_PREFIX = name;
export default createPrefixer(MODULE_PREFIX);
