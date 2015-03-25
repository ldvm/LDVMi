import React from 'react'
import Router from 'react-router'
import Bootstrap from 'react-bootstrap'
import {addVisualization, addDataSource} from '../api.jsx'

var Grid = Bootstrap.Grid;
var Jumbotron = Bootstrap.Jumbotron;
var Input = Bootstrap.Input;

export default React.createClass({
    mixins: [Router.Navigation],

    visualize: function () {
        var endpointUri = this.refs.input.getValue();

        addVisualization(endpointUri)
            .then(function (response) {
                var dataSourceId = response.entity.id;
                return addDataSource(dataSourceId, dataSourceId, '(React) Visualization ' + endpointUri);
            })
            .then(function (response) {
                var visualisationId = response.entity.id;
                this.transitionTo('visualisation', {id: visualisationId});
            }.bind(this))
    },

    render: function () {
        return (
            <Grid>
                <Jumbotron>
                    <h1>Payola LDVM visualizations</h1>

                    <p>
                        This application is a part of the Payola platform. Its goal is to
                        provide visualizations of Linked Data datasets using principles of
                        Linked Data Visualization Model (LDVM). You can use it with your own
                        SPARQL Endpoint.
                    </p>

                    <Input type="text" placeholder="Enter SPARQL endpoint URL" ref="input"/>
                    <Input type="submit" bsStyle="primary" value="Visualize"
                           onClick={this.visualize}/>
                </Jumbotron>
            </Grid>
        )
    }
});