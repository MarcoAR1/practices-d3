import React from 'react';
import ReactDOM from 'react-dom';
import Face from './Face.js';
import { range } from 'd3';

const width = 160;
const height = 160;
const rang = range(6*3);
const App = () => {
  return (
    <>
      {rang.map(() => (
        <Face
          width={width}
          height={height}
          centerX={width / 2}
          centerY={height / 2}
          strokeWidth={10}
          eyeRadius={10}
          eyeOffSetX={30}
          eyeOffSetY={30}
          mouthWidth={10}
          mouthRadius={40}
        />
      ))}
    </>
  );
};

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
