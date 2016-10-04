import React from 'react'

// A really ugly way to reset the background color of the whole page without manipulating with
// styles and classes. Created for the purpose of embedded version of applications.

function createStyleMarkup(color) {
  return { __html: `
    <style type="text/css">
      body { background-color: ${color} !important; }
    </style>
  `};
}

const ResetBodyBackground = ({ color }) => (
  <div dangerouslySetInnerHTML={createStyleMarkup(color || 'transparent')}></div>
);

export default ResetBodyBackground;
