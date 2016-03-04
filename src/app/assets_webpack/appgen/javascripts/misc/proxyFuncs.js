import React from 'react'

/**
 * Simple enhancer that wraps all callbacks incoming in props by proxy functions. The idea is that
 * whereas the callback might change, the wrapping proxy function remains the same from the moment
 * it's created. The wrapper class maintains a list of up-to-date callbacks and each proxy function
 * simply invokes corresponding callback. This approach enables us to use pure render optimizations
 * on the child components.
 *
 * (Very often a function passed down in props is instantiated as an arrow function in the parent
 * component's render method. It means that the function changes every time the parent component is
 * re-rendered. This approach deals with this problem.)
 */
export default function proxyFuncs(Component) {
  return class Wrapper extends React.Component {

    constructor(props) {
      super(props);
      this.funcs = {};
      this.proxies = {};
      this.updateProxies(props);
    }

    componentWillReceiveProps(nextProps) {
      this.updateProxies(nextProps);
    }

    updateProxies(props) {
      const { funcs, proxies } = this;

      for (const name in props) {
        if (props.hasOwnProperty(name) && typeof props[name] === 'function') {
          funcs[name] = props[name];
          if (!proxies[name]) {
            proxies[name] = (...args) => funcs[name].apply(null, args);
          }
        }
      }
    }

    render() {
      const props = Object.assign({}, this.props, this.proxies);
      return <Component {...props} />;
    }
  }
}
