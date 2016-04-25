import React, { PropTypes } from 'react'
import { saveConfiguration, saveConfigurationStatusSelector } from '../ducks/configuration'
import { dirtySelector } from '../ducks/dirty'

import createSaveButton from '../../../manageApp/containers/createSaveButton'

export default createSaveButton(saveConfiguration, saveConfigurationStatusSelector, dirtySelector);
