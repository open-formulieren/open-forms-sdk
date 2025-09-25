import React, {useContext} from 'react';

import type {ButtonText} from '@/data/forms';

type Literals = Record<string, ButtonText>;

const LiteralContext = React.createContext<Literals>({});
LiteralContext.displayName = 'LiteralContext';

export interface LiteralsProviderProps {
  literals: Literals;
  children: React.ReactNode;
}

const LiteralsProvider: React.FC<LiteralsProviderProps> = ({literals, children}) => (
  <LiteralContext.Provider value={literals}>{children}</LiteralContext.Provider>
);

const EMPTY_LITERAL: ButtonText = {resolved: ''};

export interface LiteralProps {
  name: string;
}

const Literal: React.FC<LiteralProps> = ({name}) => {
  const literals = useContext(LiteralContext);
  const value = (literals[name] ?? EMPTY_LITERAL).resolved;
  return value;
};

export default Literal;
export {LiteralsProvider, Literal};
