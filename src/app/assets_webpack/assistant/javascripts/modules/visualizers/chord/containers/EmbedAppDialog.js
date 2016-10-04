import React, { Component, PropTypes } from 'react'
import { OrderedMap } from 'immutable'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import Button from '../../../../components/Button'
import Dialog from '../../../core/containers/Dialog'
import prefix from '../prefix'
import withDialogControls from '../../../core/containers/withDialogControls'
import EmbedCodeGenerator from '../../../app/components/EmbedCodeGenerator'
import { listsSelector } from '../ducks/lists'
import { applicationUrl } from '../../../app/applicationRoutes'
import { applicationSelector } from '../../../app/ducks/application'
import { Application } from '../../../app/models'
import locationOrigin from '../../../../misc/locationOrigin'

const DEFAULT = 'default';
export const dialogName = prefix('EMBED_APP_DIALOG');

function generateUrl(application, listId) {
  return locationOrigin() + applicationUrl(application) + '/embed' + (listId != DEFAULT ? '/' + listId : '');
}

class EmbedAppDialog extends Component {

  static propTypes = {
    lists: PropTypes.instanceOf(OrderedMap).isRequired,
    application: PropTypes.instanceOf(Application).isRequired,
    dialogClose: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedList: DEFAULT
    }
  }

  render() {
    const { lists, application, dialogClose } = this.props;
    const { selectedList } = this.state;

    const actions = [
      <Button label="Close" onTouchTap={() => dialogClose(dialogName)} />
    ];
    
    return (
      <span>
        <Dialog name={dialogName} title="Embed" actions={actions}>
          List to be visualized: <DropDownMenu
            value={selectedList}
            onChange={(event, index, selectedList) => this.setState({ selectedList })}
          >
            <MenuItem value={DEFAULT} primaryText="Default (according to app's settings)" />
            {lists.toList().map(list =>
              <MenuItem value={list.id} primaryText={list.name} key={list.id} />
            )}
          </DropDownMenu>
          <EmbedCodeGenerator url={generateUrl(application, selectedList)} />
        </Dialog>
      </span>
    );
  }
}

const selector = createStructuredSelector({
  application: applicationSelector,
  lists: listsSelector
});

export default connect(selector)(withDialogControls(EmbedAppDialog));
