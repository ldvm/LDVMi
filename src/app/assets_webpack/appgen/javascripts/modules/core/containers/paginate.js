import React, { Component, PropTypes } from 'react'
import { List } from 'immutable'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import { resetPaginator, destroyPaginator, createPaginatorSelector, createPageContentSelector } from '../ducks/pagination'
import { Paginator } from '../models'

/**
 * Higher-order component that transparently paginates over provided data set.
 *
 * How it works: The itemsSelector defines the data set to be paginated. Since it's a selector,
 * it can be any data, coming from either the global state or props. When mounted, this higher-order
 * component initializes a paginator of given name with the provided default page size and total
 * count corresponding to the size of data set. After that it keeps the paginator synchronized with
 * the data set, i. e., if the data set changes (items are added or removed), the paginator is
 * reset. The current page content is extracted from the data set and passed to the inner composed
 * component via a prop specified by a pageContentProp.
 *
 * This component does not provide pagination controls. Simply drop the <Paginate /> component
 * literary anywhere and give it the chosen paginator name. It will work.
 *
 * Notes:
 *  - Only completely prefetched data sets are supported.
 *  - Only pagination over Immutable.List is supported
 *  - If the paginator state and data set are not synchronized, the inner composed component is not
 *    rendered. That typically happens in the beginning, before the paginator is initialized, and
 *    then whenever the data set size changes. That can cause a short flicker.
 *
 * @param {string} paginatorName - name of the paginator
 * @param {func} itemsSelector - data to be paginated
 * @param {int} pageSize - default page size
 * @param {string} pageContentProp - name of the prop, through which the current page content is
 *  injected into the composed component.
 * @param ComposedComponent
 */
export default function paginate({ paginatorName, itemsSelector, pageSize, pageContentProp }, ComposedComponent) {
  function throwWarn(warn) {
    console.warn(warn + ' Check the pagination of ' + ComposedComponent.name);
  }

  if (!paginatorName) {
    throwWarn('paginatorName seems to be empty.');
  }
  if (!itemsSelector) {
    throwWarn('itemsSelector seems to be undefined.');
  }
  if (!pageSize) {
    throwWarn('pageSize seems be empty. It should be a positive integer.');
  }
  if (!pageContentProp)  {
    throwWarn('pageContentProp seems to be empty.');
  }

  class Paginate extends Component {
    static propTypes = {
      items: PropTypes.instanceOf(List).isRequired,
      paginator: PropTypes.instanceOf(Paginator).isRequired,
      pageContent: PropTypes.instanceOf(List).isRequired
    };

    componentWillMount() {
      this.resetPaginator({
        pageSize: pageSize,
        totalCount: this.props.items.size
      });
    }

    componentWillUnmount() {
      const { dispatch } = this.props;
      dispatch(destroyPaginator(paginatorName));
    }

    componentWillReceiveProps(nextProps) {
      if (this.props.items.size != nextProps.items.size) {
        this.resetPaginator({
          totalCount: nextProps.items.size
        });
      }
    }

    resetPaginator(paginator) {
      const { dispatch } = this.props;
      dispatch(resetPaginator(paginatorName, paginator));
    }

    render() {
      const { items, paginator, pageContent } = this.props;

      // We wait until the paginator's inner state synchronizes with the current data set
      // (see componentWillReceiveProps)
      if (items.size != paginator.totalCount) {
        return null;
      }

      // Inject page content into the composed component using a property name chosen by the user.
      let newProps = Object.assign({}, this.props);
      newProps[pageContentProp] = pageContent;

      return <ComposedComponent {...newProps} />;
    }
  }

  const selector = createStructuredSelector({
    items: itemsSelector,
    paginator: createPaginatorSelector(paginatorName),
    pageContent: createPageContentSelector(paginatorName, itemsSelector)
  });

  return connect(selector)(Paginate);
}
