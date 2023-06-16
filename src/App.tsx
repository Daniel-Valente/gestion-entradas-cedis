import React from 'react';
import './App.css';
import { Content } from 'antd/es/layout/layout';
import ManageDocks from './views/ManageDocks';

function App() {
  return (
    <div className="App">
      <Content id='main-content'>
        <ManageDocks/>
      </Content>
    </div>
  );
}

export default App;
