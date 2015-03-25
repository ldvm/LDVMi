import React from 'react'
import Router from 'react-router'
import Bootstrap from 'react-bootstrap'
import api from '../api.jsx'

var Jumbotron = Bootstrap.Jumbotron;
var Grid = Bootstrap.Grid;

export default React.createClass({
    mixins: [Router.State],

    getInitialState: function () {
        return {visualization: null}
    },

    componentDidMount: function () {
        api.visualization(this.getParams().id)
            .then(function (response) {
                this.setState({
                    visualization: response.entity.visualization
                })
            }.bind(this))
    },

    render: function () {
        if (this.state.visualization) {
            return this.renderVisualization();
        } else {
            return <div>Loading visualization...</div>
        }
    },

    renderVisualization: function () {
        var visualization = this.state.visualization;

        return (
            <Grid>
                <Jumbotron>
                    <h3>{visualization.name} (id: {visualization.id})</h3>
                </Jumbotron>
            </Grid>
        )
    }
});