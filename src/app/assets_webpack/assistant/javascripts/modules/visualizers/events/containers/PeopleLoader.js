import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { getEventPeople, getEventPeopleReset, peopleSelector, peopleStatusSelector } from '../ducks/people'
import { PromiseStatus } from '../../../core/models'
import PromiseResult from '../../../core/components/PromiseResult'

class PeopleLoader extends Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        people: PropTypes.instanceOf(Array).isRequired,
        status: PropTypes.instanceOf(PromiseStatus).isRequired
    };

    componentWillMount() {
        const {dispatch} = this.props;
        dispatch(getEventPeople("http://dbpedia.org/resource/World_Film_Festival_of_Bangkok"));
    }

    componentWillUnmount() {
        const {dispatch} = this.props;
        dispatch(getEventPeopleReset());
    }

    render() {
        const {people, status} = this.props;

        if (!status.done) {
            return <PromiseResult status={status} error={status.error} loadingMessage="Loading event people..."/>
        }
        
        if (people==null || people.length == 0) {
            return <p>No people loaded - nothing to visualize.</p>
        }
        const listItems = people.map((p) =>
            <li key={p.url}>{p.name}</li>
        );

        return (
            <ul>{listItems}</ul>
        );
    }
}

const selector = createStructuredSelector({
    people: peopleSelector,
    status: peopleStatusSelector
});

export default connect(selector)(PeopleLoader);
