import React from 'react'
import * as Icons from 'material-ui/svg-icons';

/**
 * Transform icon name from the CamelCase format into the format with underscores. Also the
 * Material UI library prefixes the icon names with categories. Those prefixes are also removed.
 *
 * Example: "ImagePhotoSizeSelectSmall" transform into "photo_size_select_small"
 *
 * The "decapitalized" names correspond to how the icons are named when used with the web font.
 * (Which was the original way icons were used in this app. This is a wrapper providing compatibility)
 */
const decapitalize = str => {
  const segments = str.split(/(?=[A-Z])/)
  segments.shift(); // Remove first part which is the icon category
  return segments.map(segment => segment.toLowerCase()).join('_')
};

// Store the SVG icons under their decapitalized names.
const icons = {};
Object.keys(Icons).forEach(iconName => {
  icons[decapitalize(iconName)] = Icons[iconName];
});

const Icon = props => {
  const IconComponent = icons[props.icon];

  if (!IconComponent) {
    console.warn(`The icon "${props.icon}" does not exist!`);
    return <div {...props}>Missing icon!</div>
  }

  return <IconComponent {...props} />;
};

export default Icon;
