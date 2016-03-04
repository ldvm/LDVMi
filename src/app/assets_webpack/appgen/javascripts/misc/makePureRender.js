import React from 'react'
import PureComponent from 'react-pure-render/component'
import proxyFuncs from './proxyFuncs'

export default function makePureRender(Component) {
  class Wrapper extends PureComponent {
    render() {
      return <Component {...this.props} />;
    }
  }

  return proxyFuncs(Wrapper);
}

