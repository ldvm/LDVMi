import React from 'react'
import Router from 'react-router'
import {RouteHandler, Link} from 'react-router'
import {Navbar, Nav, NavItem} from 'react-bootstrap'

export default React.createClass({
    render: function () {
        return <div>
            <Navbar inverse fluid fixedTop brand={this.renderBrand()}>
                <Nav>
                    <li><Link to="signup">Sign up</Link></li>
                    <li><Link to="home">Sign In</Link></li>
                </Nav>
            </Navbar>
            <br /><br /><br />
            <RouteHandler/>
        </div>
    },

    renderBrand: function () {
        return <Link to="home">Payola Application Generator</Link>;
    }
});