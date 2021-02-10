import React from 'react';
import ReactDOM from 'react-dom';
import App from './js/App';
import {BrowserRouter} from "react-router-dom";

import './css/index.css';
import 'bootstrap/dist/css/bootstrap.min.css';


ReactDOM.render(
  <React.StrictMode>
      <BrowserRouter>
          <App />
      </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
