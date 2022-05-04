import React from 'react';
import { Provider } from 'react-redux';

// import logo from './logo.svg';
import './App.css';
import { store } from './stores';
import Main from './pages/main';

function App() {
  return (
    <Provider store={store}>
      <Main />
    </Provider>
  );
}

export default App;
