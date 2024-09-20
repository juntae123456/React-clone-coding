import React, { Component } from 'react';

class MyClassComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: 'Hello, World!'
    };
  }

  render() {
    return (
      <div>
        {this.state.message}
      </div>
    );
  }
}

export default MyClassComponent;nent;