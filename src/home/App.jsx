import React from 'react';

import './App.css';

export default class App extends React.Component {
  constructor() {
    super();
    this.message = 'My React App!';
  }

  render() {
    return <div>
      <h1>{this.message}</h1>
    </div>;
  }
}
