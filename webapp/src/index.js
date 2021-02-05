import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import { BrowserRouter } from "react-router-dom";

const theme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: "#1f4068"
    },
    secondary: {
      main: "#e43f5a"
    }
    //error:
    //warning:
    //info:
    //success:
  }
});

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals(console.log);
