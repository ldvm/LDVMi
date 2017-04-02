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

        // EVENT INFO:
        var eventComponent = <VisualizationMessage>
            <CenteredMessage>To view more information about events, click on them in the timeline.</CenteredMessage>
        </VisualizationMessage>;

        if(selectedEvent.isValid){
            var event = selectedEvent.event;
            var dateString = moment(event.date).format('DD.MM.YYYY');

            eventComponent = <div>
                <h3>Event info:</h3>
                <p><b>{event.name}</b></p>
                <p>{event.description}</p>
                <p>{dateString}</p>
                <a href={event.info}>Event Link</a>
            </div>;
        }

        // EVENT PEOPLE:
        var peopleComponent = <VisualizationMessage>
            <CenteredMessage>Could not load people for selected event.</CenteredMessage>
        </VisualizationMessage>;

        if (!status.done) {
            peopleComponent = <PromiseResult status={status} error={status.error} loadingMessage="Loading event people..."/>
        }
        if (people.length > 0) {
            var renderPerson = function (person) {
                var style = {width: 100, height: 150, "objectFit": 'contain'};
                return <tr key={person.url}>
                    <td><img src={person.image} alt="No image available" style={style}/></td>
                    <td>
                        <p><b>{person.name}</b></p>
                        <p>{person.description}</p>
                        <a href={person.info}>Wiki Link</a>
                    </td>
                </tr>
            };

            peopleComponent = <div>
                <h3>People associated with this event</h3>
                <table>
                    <tbody>{people.map(p=>renderPerson(p))}</tbody>
                </table>
            </div>
        }

        // RENDER
        return  <div>
            {eventComponent}
            <hr/>
            {peopleComponent}
        </div>
    }
}

const selector = createStructuredSelector({
    people: peopleSelector,
    status: peopleStatusSelector
});

export default connect(selector)(EventInfoContainer);
