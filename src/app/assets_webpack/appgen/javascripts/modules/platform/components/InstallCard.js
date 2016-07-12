import React, { PropTypes } from 'react'
import { List } from 'immutable'
import PaperCard from '../../../components/PaperCard'
import Alert from '../../../components/Alert'
import Button from '../../../components/Button'
import { PromiseStatus } from '../../core/models'
import PromiseResult from '../../core/components/PromiseResult'

const InstallCard = ({ install, installResults, installStatus }) => {
  return (
    <PaperCard title="Install" subtitle="Import default LDVM components">
      <div>Your LinkedPipes Application Generator instance seems to be empty. No visualizers have
      been found.</div>
      <p><strong>Do you wish to install a couple of default LDVM components and data sources so that
      you can immediately start generating applications?</strong></p>
      <p>The LDVM components and data sources will be downloaded from public GitHub repositories.
      You need to be online to use this install script.</p>

      {installStatus.done ?
        <div>
          {installResults.map((result, i) =>
            result.get('success') ?
              <Alert key={i} info>{result.get('message')}</Alert> :
              <Alert key={i} danger>{result.get('message')}</Alert>
          )}
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
