/**
 * Simple utility that can be used to detect when selector is recalculated. That can be useful
 * when you need to detect why your composed selector is not memoizing. Simply wrap any selector
 * with this function, give it a name and start logging.
 *
 * For more info, see: https://github.com/reactjs/reselect/issues/71
 */
export default function selectorLogger(selector, name) {
  let lastValue = undefined;
  return (state, props) => {
    const result = selector(state, props);

    if (result !== lastValue) {
      console.log(`Selector recalculated: ${name}`, result);
    }

    lastValue = result;
    return result;
  }
};
