import React from 'react'
import Router from 'react-router'
import Bootstrap from 'react-bootstrap'

var Grid = Bootstrap.Grid;
var Jumbotron = Bootstrap.Jumbotron;
var Input = Bootstrap.Input;

export default React.createClass({
    mixins: [Router.Navigation],

    render: function () {
        return (
            <Grid>
                <Jumbotron>
                    <h1>Welcome stranger!</h1>
                </Jumbotron>
            </Grid>
        )
    }
});