import Colors from 'material-ui/styles/colors';
import ColorManipulator from 'material-ui/utils/color-manipulator';
import Spacing from 'material-ui/styles/spacing';
import zIndex from 'material-ui/styles/zIndex';
import * as Theme from './theme'


export default {
  spacing: Spacing,
  zIndex: zIndex,
  fontFamily: 'Roboto, sans-serif',
  palette: {
    primary1Color: Theme.primary, // AppBar, Secondary Button, Check boxes and other elements
    primary2Color: Colors.teal700,
    primary3Color: Colors.lightBlack,
    accent1Color: Theme.primary, // Primary button
    accent2Color: Colors.grey100,
    accent3Color: Colors.grey500,
    textColor: Colors.darkBlack,
    alternateTextColor: Colors.white,
    canvasColor: Colors.white,
    borderColor: Colors.grey300,
    disabledColor: ColorManipulator.fade(Colors.darkBlack, 0.3),
    pickerHeaderColor: Colors.cyan500
  }
};