import Immutable from 'immutable'
import React from 'react'
import PureComponent from 'react-pure-render/component'
import shouldComponentUpdate from 'react-pure-render/function'
import proxyFuncs from './proxyFuncs'

export default function makePureRender(Component) {
  class PureRenderWrapper extends PureComponent {
    render() {
      return <Component {...this.props} />;
    }
  }

  return proxyFuncs(PureRenderWrapper);
}

// Debug version:

function arrayDiff(array1, array2) {
  return array1.filter(i => array2.indexOf(i) < 0)
}

function printDiff(propsA, propsB) {
  if (propsA === propsB) {
    return;
  }

  if (propsA === null) {
    console.log('Old values are null');
    return;
  }
  if (propsB === null) {
    console.log('New values are null');
    return;
  }

  const propNamesA = Object.keys(propsA);
  const propNamesB = Object.keys(propsB);

  const disappeared = arrayDiff(propNamesA, propNamesB);
  const appeared = arrayDiff(propNamesB, propNamesA);

  if (disappeared.length > 0) {
    console.log('Following values disappeared: ' + disappeared.join(', '));
  }
  if (appeared.length > 0) {
    console.log('Following values are new: ' + appeared.join(', '));
  }

  for (let name of propNamesA) {
    if (!propsB.hasOwnProperty(name)) {
      console.log(`  - value of '${name}' is missing in new values.`);
    } else if (propsA[name] !== propsB[name]) {
      console.log(`  - value of '${name}' is different`);

      if (Immutable.is(propsA[name], propsB[name])) {
        console.log(`    (Values seem to have the same content. Perhaps a new instance was created when it shouldn't?)`);
      }
    }
  }
}

export function makePureRenderDebug(Component) {
  class Wrapper extends PureComponent {
    shouldComponentUpdate(nextProps, nextState) {
      console.log('Should ' + Component.name + ' update? ');
      const shouldUpdate = shouldComponentUpdate.bind(this)(nextProps, nextState);

      if (shouldUpdate) {
        console.log('Yes, it should, because:');
        printDiff(this.props, nextProps);
        printDiff(this.state, nextState);
      } else {
        console.log('No, the props remain the same.');
      }

      return shouldUpdate;
    }

    render() {
      return <Component {...this.props} />;
    }
  }

  return proxyFuncs(Wrapper);
}

