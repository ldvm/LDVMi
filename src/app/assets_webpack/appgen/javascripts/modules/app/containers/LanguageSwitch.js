import React, { PropTypes } from 'react'
import { createSelector, createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import { List } from 'immutable'
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import Button from '../../../components/Button'
import { selectLanguage, langSelector, availableLangsSelector } from '../ducks/lang'
import languages from '../../../misc/languages'

const LanguageSwitch = ({ dispatch, lang, availableLangs }) => {

  // If there are no languages to switch between, why bother rendering the menu?
  if (availableLangs.size < 2) {
    return <span />;
  }

  return (
    <IconMenu
      iconButtonElement={<Button raised icon="language" label={languages[lang]} />}
      anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
      targetOrigin={{horizontal: 'right', vertical: 'top'}}
    >
      {availableLangs.map(l =>
        <MenuItem key={l}
          primaryText={languages[l]}
          onTouchTap={() => dispatch(selectLanguage(l))}
        />
      )}
    </IconMenu>
  )
};

LanguageSwitch.propTypes = {
  dispatch: PropTypes.func.isRequired,
  lang: PropTypes.string.isRequired,
  availableLangs: PropTypes.instanceOf(List).isRequired
};

const sortedAvailableLangsSelector = createSelector(
  [availableLangsSelector],
  availableLangs => availableLangs.toList().sortBy(l => languages[l])
);

const selector = createStructuredSelector({
  lang: langSelector,
  availableLangs: sortedAvailableLangsSelector
});

export default connect(selector)(LanguageSwitch);
