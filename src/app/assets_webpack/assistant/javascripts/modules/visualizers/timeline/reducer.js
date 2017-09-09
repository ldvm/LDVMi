import { combineReducers } from 'redux'
import instants from './ducks/instants'
import intervals from './ducks/intervals'
import firstLevel from './ducks/firstLevel'
import selectedTimeRecord from './ducks/selectedTimeRecord'
import selectedFirstLevelTypes from './ducks/selectedFirstLevelTypes'
import selectedFirstLevelPredicates from './ducks/selectedFirstLevelPredicates'
import secondLevel from './ducks/secondLevel'
import selectedSecondLevelThings from './ducks/selectedSecondLevelThings'
import selectedSecondLevelPredicates from './ducks/selectedSecondLevelPredicates'
import timeRange from './ducks/timeRange'
import colors from './ducks/colors'
import count from './ducks/count'
import dirty from './ducks/dirty'

const rootReducer = combineReducers({
  instants,
  intervals,
  selectedTimeRecord,
  firstLevel,
  selectedFirstLevelTypes,
  selectedFirstLevelPredicates,
  secondLevel,
  selectedSecondLevelThings,
  selectedSecondLevelPredicates,
  timeRange,
  colors,
  count,
  dirty
});

export default rootReducer;