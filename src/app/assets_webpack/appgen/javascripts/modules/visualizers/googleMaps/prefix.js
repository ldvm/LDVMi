import createPrefixer from '../../../misc/createPrefixer'
import {getModuleName} from '../../../misc/utils'

export const MODULE_PREFIX = getModuleName(__filename);
export default createPrefixer(MODULE_PREFIX);
