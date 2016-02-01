import React from 'react'
import Paper from 'material-ui/lib/paper';

const PaperCard = ({title, subtitle, color, children}) => (
  <Paper className="paper-card">
    <div className="paper-card-header">
      <h2>
        {title}
        {subtitle && <small>{subtitle}</small>}
      </h2>
    </div>
    <div className="paper-card-body">
      {children}
    </div>
  </Paper>
);

export default PaperCard;
