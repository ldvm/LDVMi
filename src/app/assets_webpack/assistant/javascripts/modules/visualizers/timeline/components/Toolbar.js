import React, { Component, PropTypes } from 'react'
import ConfigurationToolbar from '../../../common/components/ConfigurationToolbar'
import OpenEmbedAppDialogButton from './OpenEmbedAppDialogButton'
import EmbedAppDialog from '../containers/EmbedAppDialog'
import SaveButton from '../containers/SaveButton'
import BodyPadding from '../../../../components/BodyPadding'

class Toolbar extends Component {
  static propTypes = {
    hidden: PropTypes.bool.isRequired,
    configurations: PropTypes.instanceOf(Map).isRequired
  };

  render() {
    const { configurations, hidden } = this.props;

    if (hidden) {
      return <ConfigurationToolbar label="CONFIGURE" children={configurations} hidden={true}/>
    }

    return <BodyPadding>
      <table>
        <tbody>
        <tr>
          <td><ConfigurationToolbar label="CONFIGURE" children={configurations} hidden={false}/></td>
          <td><SaveButton /></td>
          <td><OpenEmbedAppDialogButton /></td>
        </tr>
        </tbody>
      </table>
      <EmbedAppDialog />
    </BodyPadding>
  }
}

export default Toolbar;
