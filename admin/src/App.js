import React from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import AppRouter from "./router/AppRouter";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  return (
    <Router>
      <AppRouter />
    </Router>
  );
}

export default App;
