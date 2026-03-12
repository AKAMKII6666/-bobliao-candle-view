import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { useReso } from '../.';

const App = () => {

  return <div>test resohook</div>;
};

ReactDOM.render(<App />, document.getElementById('root'));
