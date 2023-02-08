import { useEffect, useRef } from 'react';
import { iCubicProps } from './lib/static/interface';

export default function Cubic(props: iCubicProps): JSX.Element {
  const canvasReference = useRef(null);

  useEffect(() => {
    console.log('☺', canvasReference);
  });

  return (
    <>
      <canvas ref={canvasReference} className={props.className}></canvas>
    </>
  );
}
