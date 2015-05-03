import React from 'react'


export default class Card extends React.Component {
    render() {
        return (
            <div className="card">
                <div className="card-header">
                    <h2>{this.props.title}
                        {this.props.subtitle ? <small>{this.props.subtitle}</small> : undefined }
                    </h2>
                </div>
                <div className="card-body card-padding">
                    {this.props.children}
                </div>
            </div>
        );
    }
}

let PropTypes = React.PropTypes;

Card.propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string
};

Card.defaultProps = {
    title: 'Title',
    subtitle: ''
};