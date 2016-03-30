import { createSelector } from 'reselect'
import parentSelector from '../selector'
import { MODULE_PREFIX } from './prefix'

export default createSelector([parentSelector], parentState => parentState[MODULE_PREFIX]);
