import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { useReso } from '../.';

const App = () => {
  debugger;
  console.log(useReso);

  return <div>test resohook</div>;
};

ReactDOM.render(<App />, document.getElementById('root'));
