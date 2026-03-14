import {JSONEditor} from '@open-formulieren/monaco-json-editor';
import {Heading2} from '@utrecht/component-library-react';
import {useState} from 'react';

const JsonLogicPlayground: React.FC = () => {
  const [numResultRows, setNumResultRows] = useState(1);

  const result = {foo: 'bar'};

  return (
    <>
      <section>
        <Heading2>Result</Heading2>
        <div
          style={{
            '--of-json-widget-rows': Math.min(20, numResultRows),
            blockSize: 'calc(var(--of-json-widget-rows, 3) * 19px)',
            border: 'solid 1px #ccc',
          }}
        >
          <JSONEditor
            value={result}
            theme="light"
            readOnly
            onChange={() => {}}
            lineCountCallback={(numLines = 1) => setNumResultRows(numLines)}
          />
        </div>
      </section>
    </>
  );
};

export default JsonLogicPlayground;
