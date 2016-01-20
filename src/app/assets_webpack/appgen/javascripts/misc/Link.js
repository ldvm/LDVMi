import React, { Component } from 'react'
import { Link as RouterLink } from 'react-router'
import { baseUrl } from '../config'

export default class Link extends Component {
  render() {
    // TODO: props.to might be an object
    return <RouterLink {...this.props} to={baseUrl + '/' + this.props.to} />
  }
}
