import React, { Component, PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import scriptjs from 'scriptjs'
import Button from '../../../components/Button'

class GoogleSignIn extends Component {
  static propTypes = {
    clientId: PropTypes.string.isRequired,
    onSuccess: PropTypes.func.isRequired,
    onFailure: PropTypes.func.isRequired,
    disabled: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.state = {
      buttonReady: false
    }
  }

  componentDidMount() {
    this.initApi();
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  initApi() {
    scriptjs('https://apis.google.com/js/api:client.js', () => {
      if (gapi.auth2) {
        this.setupButton();
      } else {
        gapi.load('auth2', () => {
          gapi.auth2.init({
            client_id: this.props.clientId,
            cookiepolicy: 'single_host_origin'
          });
          this.setupButton();
        });
      }
    });
  }

  setupButton() {
    // Apparently, isMounted() is an antipattern and is deprecated. But I need it as "cancelling"
    // the requests of scriptjs and gapi would be complicated (if possible at all).
    // More here: https://facebook.github.io/react/blog/2015/12/16/ismounted-antipattern.html
    if (this.mounted) {
      const buttonDOMElement = findDOMNode(this.refs.button);
      gapi.auth2.getAuthInstance().attachClickHandler(buttonDOMElement, {},
        ::this.onSuccess, ::this.onFailure);
      this.setState({ buttonReady: true });
    }
  }

  onSuccess(googleUser) {
    this.props.onSuccess({
      name: googleUser.getBasicProfile().getName(),
      email: googleUser.getBasicProfile().getEmail(),
      token: googleUser.getAuthResponse().id_token
    });
  }

  onFailure(error) {
    this.props.onFailure(error);
  }

  render() {
    const { disabled } = this.props;
    const { buttonReady } = this.state;

    return  (
      <Button raised default fullWidth
        ref="button"
        label="Sign in with Google"
        disabled={!buttonReady || disabled}
        image="/assets/images/google_signin.png"
      />
    );
  }
}

export default GoogleSignIn;
