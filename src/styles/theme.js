import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  "object": {
    "title": {
        "main": {
            "fontSize": "12px",
            "fontFamily": "Arial"
        }
    }
},
  palette: {
    primary: {
      light: '#D4FBFF',
      main: '#00AFBF',
      dark: '#3F3D56'
    },
    secondary: {
      main: '#FFFFFF'
    },
    text: {
      primary: '#3F3D56',
      secondary: '#8B9DAF',
      hint: '#2DCE89'
    },
    background: {
      default: '#FFFFFF'
    },
    info: {
      main: '#00AFBF'
    },
    success: {
      main: '#2AD846'
    },
    error: {
      main: '#F2264B'
    },
    action: {
      active: '#00ABE1'
      // hover: '',
      // selected: '',
      // disabled: '',
      // focus: ''
    }
  },
  typography: {
    h4: {
      fontSize: '2.25rem',
      lineHeight: '2.5rem',
      letterSpacing: '0.0125rem'
    },
    h6: {
      fontSize: '1.125rem',
      lineHeight: '1.25rem',
      letterSpacing: '0rem'
    },
    subtitle: {
      fontSize: '1rem',
      lineHeight: '1rem',
      letterSpacing: '0.0125rem'
    },
    subtitle2: {
      fontSize: '0.875rem',
      lineHeight: '1rem',
      letterSpacing: '0.0125rem'
    },
    body1: {
      fontSize: '1rem',
      lineHeight: '1.125rem',
      letterSpacing: '0rem'
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: '1rem',
      letterSpacing: '0rem'
    }
  },
  spacing: 6
})

export default theme
