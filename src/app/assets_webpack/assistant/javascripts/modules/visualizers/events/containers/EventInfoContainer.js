import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { getEventPeople, getEventPeopleReset, peopleSelector, peopleStatusSelector } from '../ducks/people'
import { PromiseStatus } from '../../../core/models'
import PromiseResult from '../../../core/components/PromiseResult'
import { EventInfo } from '../models'
import moment from "moment";
import CenteredMessage from '../../../../components/CenteredMessage'
import VisualizationMessage from '../components/VisualizationMessage'

class PeopleLoader extends Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        event: PropTypes.instanceOf(EventInfo).isRequired,
        people: PropTypes.instanceOf(Array).isRequired,
        status: PropTypes.instanceOf(PromiseStatus).isRequired
    };

    componentWillMount() {
        const { dispatch, event } = this.props.dispatch;
        if (event) {
            dispatch(getEventPeople(event.url));
        }
    }

    componentWillUnmount() {
        const {dispatch} = this.props;
        dispatch(getEventPeopleReset());
    }

    render() {
        const {people, event, status} = this.props;

        if (!status.done) {
            return <PromiseResult status={status} error={status.error} loadingMessage="Loading event people..."/>
        }
        
        if(!event){
            return
            <VisualizationMessage>
                <CenteredMessage>To view more information about events, click on them in the timeline.</CenteredMessage>
            </VisualizationMessage>
        }

        if (!people){
            return
            <VisualizationMessage>
                <CenteredMessage>Error loading people connected to this event</CenteredMessage>
            </VisualizationMessage>
        }

        var renderPerson = function(person){
            return
            <tr>
                <td><img src={person.image} alt="Person Image" style="width:50px;height:50px;"/></td>
                <td>
                    <p><b>{person.name}</b></p>
                    <p>{person.description}</p>
                    <a href={person.info}>Wiki Link</a>
                </td>
            </tr>
        }

        var startString = moment(event.start).format('YYYYMMDD');
        var endString = moment(event.end).format('YYYYMMDD');
        return <div>
            <p><b>{event.name}</b></p>
            <p>{event.description}</p>
            <p>From {startString} to {endString}</p>
            <a href={event.info}>Event Link</a>
            <br/>
            <table>
                {people.map(p=>renderPerson(p))}
            </table>
        </div>
    }
}

const selector = createStructuredSelector({
    people: peopleSelector,
    status: peopleStatusSelector
});

export default connect(selector)(PeopleLoader);
