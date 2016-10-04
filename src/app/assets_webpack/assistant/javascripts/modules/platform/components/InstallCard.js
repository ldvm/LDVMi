import React, { PropTypes } from 'react'
import { List } from 'immutable'
import PaperCard from '../../../components/PaperCard'
import Alert from '../../../components/Alert'
import Button from '../../../components/Button'
import { PromiseStatus } from '../../core/models'
import PromiseResult from '../../core/components/PromiseResult'

const InstallCard = ({ install, installResults, installStatus }) => {
  return (
    <PaperCard title="Install" subtitle="Import default LDVM components and data sets">
      <div>Your LinkedPipes Visualization Assistant instance seems to be empty. No visualizers have
      been found.</div>
      <p><strong>Do you wish to install a couple of default LDVM components and data sets so that
      you can immediately start generating applications?</strong></p>
      <p>The LDVM components and data sets will be downloaded from public GitHub repositories.
      You need to be online to use this install script. The data sets will be imported
      to the local Virtuoso triple store for the best performance.</p>

      <p>The whole process might take a couple of minutes.</p>

      {installStatus.done ?
        <div>
          {installResults.map((result, i) =>
            result.get('success') ?
              <Alert key={i} info>{result.get('message')}</Alert> :
              <Alert key={i} danger>{result.get('message')}</Alert>
          )}
          <Alert success>Installation successfully finished.</Alert>
        </div>
        :
        <div>
          <PromiseResult status={installStatus} loadingMessage="Installation in progress..." />
          <Button raised warning fullWidth
            onClick={install}
            disabled={installStatus.isLoading}
            icon="system_update_alt"
            label="Install LDVM components and data sources" />
        </div>
      }
    </PaperCard>
  );
};

InstallCard.propTypes = {
  install: PropTypes.func.isRequired,
  installResults: PropTypes.instanceOf(List).isRequired,
  installStatus: PropTypes.instanceOf(PromiseStatus).isRequired
};

export default InstallCard;
