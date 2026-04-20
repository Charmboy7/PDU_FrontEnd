import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Wizard from './components/Wizard';
import Header from './components/Header';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <Header />
      <div className="container py-3">
        <div className="row justify-content-center">
          <div className="col-md-10">
            <Wizard />
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
