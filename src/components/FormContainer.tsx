import {useContext} from 'react';

import {ConfigContext} from '@/Context';
import useFormContext from '@/hooks/useFormContext';

import type {CardProps} from './Card';
import Card from './Card';

/**
 * Container component for wrapping the Card component.
 *
 * This is a wrapper that helps render (or not) the title of a form.
 */
const FormContainer = (props: CardProps & Omit<React.ComponentPropsWithoutRef<'div'>, 'title'>) => {
  const {showFormTitle} = useContext(ConfigContext);
  const form = useFormContext();
  const cardTitle = showFormTitle ? props.title || form.name : undefined;
  return <Card {...props} title={cardTitle} />;
};

export default FormContainer;
