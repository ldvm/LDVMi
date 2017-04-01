import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { getEventPeople, getEventPeopleReset, peopleSelector, peopleStatusSelector } from '../ducks/people'
import { PromiseStatus } from '../../../core/models'
import PromiseResult from '../../../core/components/PromiseResult'
import { SelectedEvent } from '../models'
import moment from "moment";
import CenteredMessage from '../../../../components/CenteredMessage'
import VisualizationMessage from '../components/VisualizationMessage'

class EventInfoContainer extends Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        selectedEvent: PropTypes.instanceOf(SelectedEvent).isRequired,
        people: PropTypes.instanceOf(Array).isRequired,
        status: PropTypes.instanceOf(PromiseStatus).isRequired
    };

    componentWillReceiveProps(nextProps){
        const {dispatch, selectedEvent} = nextProps;
        if (selectedEvent.isValid && this.props.selectedEvent != selectedEvent) {
            dispatch(getEventPeople(selectedEvent.event));
        }
    }

    componentWillUnmount() {
        const {dispatch} = this.props;
        dispatch(getEventPeopleReset());
    }

    render() {
        const {people, selectedEvent, status} = this.props;

        if(!selectedEvent.isValid){
            return <VisualizationMessage>
                <CenteredMessage>To view more information about events, click on them in the timeline.</CenteredMessage>
            </VisualizationMessage>
        }

        if (!status.done) {
            return <PromiseResult status={status} error={status.error} loadingMessage="Loading event people..."/>
        }

        if (people.length == 0){
            return <VisualizationMessage>
                <CenteredMessage>Could not load people for selected event.</CenteredMessage>
            </VisualizationMessage>
        }

        var renderPerson = function(person){
            var style = {width: 100, height:150, "object-fit": 'contain'};
            return <tr key={person.url}>
                <td><img src={person.image} alt="Person Image" style={style}/></td>
                <td>
                    <p><b>{person.name}</b></p>
                    <p>{person.description}</p>
                    <a href={person.info}>Wiki Link</a>
                </td>
            </tr>
        };

        var event = selectedEvent.event;
        var startString = moment(event.start).format('DD.MM.YYYY');
        var endString = moment(event.end).format('DD.MM.YYYY');

        return  <div>
            <div>
                <p><b>{event.name}</b></p>
                <p>{event.description}</p>
                <p>From {startString} to {endString}</p>
                <a href={event.info}>Event Link</a>
            </div>
            <hr/>
            <div>
                <table>
                    <thead>
                    <tr key="header">
                        <th>People associated with this event:</th>
                    </tr>
                    </thead>
                    <tbody>{people.map(p=>renderPerson(p))}</tbody>
                </table>
            </div>
        </div>
    }
}

const selector = createStructuredSelector({
    people: peopleSelector,
    status: peopleStatusSelector
});

export default connect(selector)(EventInfoContainer);
