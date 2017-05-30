import React, { Component, PropTypes } from 'react'

export function getAvailableVerticalSpace(element) {
  const screenHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  const offsetTop = element.getBoundingClientRect().top + window.pageYOffset - document.documentElement.clientTop;
  return screenHeight - offsetTop;
}
export function getAvailableHorizontalSpace(element){
    return element.offsetWidth - window.pageXOffset;
}

/**
 * Creates scrollable container that vertically fills in the remaining screen space
 * and makes sure that the inner content does not overflow the screen edge.
 **/
export default class FillInScreen extends Component {
  static propTypes = {
    children: React.PropTypes.element.isRequired,
    marginBottom: React.PropTypes.number,
    minHeight: React.PropTypes.number,
    forceFill: React.PropTypes.bool
  };

  static defaultProps = {
    ...Component.defaultProps,
    marginBottom: 0,
    minHeight: 0,
    forceFill: false
  };

  constructor(props) {
    super(props);
    this.updateHeight = this.updateHeight.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateHeight);
    this.updateHeight();
  }

  componentDidUpdate() {
    this.updateHeight();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateHeight);
  }

  updateHeight() {
    const { container, props: { marginBottom, minHeight, forceFill }} = this;
    const height = Math.max(getAvailableVerticalSpace(container) - marginBottom, minHeight);

    container.style[forceFill ? 'height' : 'maxHeight'] = height + 'px';
    container.style.minHeight = minHeight + 'px';
  }

  render() {
    const { children } = this.props;
    return <div
      ref={node => this.container = node}
      style={{ overflowY: 'auto'}}>{children}</div>
  }
}
