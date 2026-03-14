import {PrimaryActionButton} from '@open-formulieren/formio-renderer';
import {JSONEditor} from '@open-formulieren/monaco-json-editor';
import type {JSONObject, JSONValue} from '@open-formulieren/types';
import {CodeBlock, Heading2, Heading3} from '@utrecht/component-library-react';
import {useState} from 'react';

import evaluate from '.';

const JsonLogicPlayground: React.FC = () => {
  const [numExpressionRows, setNumExpressionRows] = useState(3);
  const [expression, setExpression] = useState<JSONObject>({'+': [1, 1]});

  const [numInputDataRows, setNumInputDataRows] = useState(3);
  const [inputData, setInputData] = useState<JSONValue>({});

  const _evaluate = () => evaluate(expression, inputData);
  const [result, setResult] = useState<JSONValue>(_evaluate);
  const [numResultRows, setNumResultRows] = useState(1);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [error, setError] = useState<any>(null);

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: '2em'}}>
      <section style={{display: 'flex', flexDirection: 'column', gap: '1em'}}>
        <Heading2>Inputs</Heading2>

        <div>
          <Heading3>Logic expression</Heading3>
          <EditorWrapper numRows={numExpressionRows} maxNumRows={50}>
            <JSONEditor
              value={expression}
              theme="light"
              onChange={value => setExpression(value)}
              lineCountCallback={(numLines = 1) => setNumExpressionRows(numLines)}
            />
          </EditorWrapper>
        </div>

        <div>
          <Heading3>Data</Heading3>
          <EditorWrapper numRows={Math.max(3, numInputDataRows)} maxNumRows={50}>
            <JSONEditor
              value={inputData}
              theme="light"
              onChange={value => setInputData(value)}
              lineCountCallback={(numLines = 1) => setNumInputDataRows(numLines)}
            />
          </EditorWrapper>
        </div>

        <PrimaryActionButton
          type="button"
          style={{alignSelf: 'start'}}
          onClick={() => {
            setError(null);
            try {
              setResult(_evaluate());
            } catch (err) {
              setError(err);
            }
          }}
        >
          Evaluate
        </PrimaryActionButton>
      </section>

      <section style={{display: 'flex', flexDirection: 'column', gap: '1em'}}>
        <Heading2>Result</Heading2>

        {error && (
          <>
            <Heading3>Error</Heading3>
            <CodeBlock style={{color: 'red'}}>{JSON.stringify(error)}</CodeBlock>
          </>
        )}

        {!error && (
          <EditorWrapper numRows={numResultRows} maxNumRows={20}>
            <JSONEditor
              value={result}
              theme="light"
              readOnly
              onChange={() => {}}
              lineCountCallback={(numLines = 1) => setNumResultRows(numLines)}
            />
          </EditorWrapper>
        )}
      </section>
    </div>
  );
};

interface EditorWrapperProps {
  numRows: number;
  maxNumRows: number;
  children: React.ReactNode;
}

const EditorWrapper: React.FC<EditorWrapperProps> = ({numRows, maxNumRows, children}) => (
  <div
    style={{
      '--of-json-widget-rows': Math.min(numRows, maxNumRows),
      blockSize: 'calc(var(--of-json-widget-rows, 3) * 19px)',
      border: 'solid 1px #ccc',
    }}
  >
    {children}
  </div>
);

export default JsonLogicPlayground;
