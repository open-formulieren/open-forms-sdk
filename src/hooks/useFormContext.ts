import {useContext} from 'react';

import {FormContext} from '@/Context';
import type {Form} from '@/data/forms';

const useFormContext = (): Form => useContext(FormContext);

export default useFormContext;
