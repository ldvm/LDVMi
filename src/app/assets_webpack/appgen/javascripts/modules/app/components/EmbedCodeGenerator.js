import React, { Component, PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import TextField from 'material-ui/lib/text-field'

function generateIframeCode(url, width, height) {
  return `<iframe width="${width}" height="${height}" src="${url}" frameborder="0"></iframe>`;
}

class EmbedCodeGenerator extends Component {
  static propTypes = {
    url: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      width: 500,
      height: 500
    }
  }

  componentDidMount() {
    findDOMNode(this.refs.url).getElementsByTagName('input')[0].select()
  }

  render() {
    const { width, height } = this.state;
    const { url } = this.props;

    return (
      <div>
        <div>
          Window size: <TextField
            value={width}
            floatingLabelText="Width"
            onChange={event => this.setState({ width: event.target.value })}
            style={{ width: '40px' }}
          /> × <TextField
            value={height}
            floatingLabelText="Height"
            style={{ width: '40px' }}
            onChange={event => this.setState({ height: event.target.value })}
          />
        </div>
        <br /><br />
        <div>
          <TextField
            fullWidth
            ref="url"
            value={url}
            onFocus={event => event.target.select()}
            floatingLabelText="Direct URL"
          />
        </div>
        <div>
          <TextField
            fullWidth
            value={generateIframeCode(url, width, height)}
            onFocus={event => event.target.select()}
            floatingLabelText="Iframe code"
          />
        </div>
      </div>
    )
  }
}

export default EmbedCodeGenerator;
