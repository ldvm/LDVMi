import React from 'react'

export default function (Component, stores) {
    class StoreConnection extends React.Component
    {
        componentDidMount() {
            stores.forEach(store =>
                store.addChangeListener(this.handleStoresChanged.bind(this))
            );
        }

        componentWillUnmount() {
            stores.forEach(store =>
                store.removeChangeListener(this.handleStoresChanged.bind(this))
            );
        }

        handleStoresChanged() {
            this.forceUpdate();
        }

        render() {
            return <Component {...this.props} />;
        }
    }

    return StoreConnection;
}