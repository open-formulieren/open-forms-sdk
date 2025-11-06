import {
  Checkbox,
  Icon,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from '@utrecht/component-library-react';
import '@utrecht/table-css';
import type {UUID} from 'crypto';
import {FormattedMessage, useIntl} from 'react-intl';

import {OFButton} from '@/components/Button';
import FAIcon from '@/components/FAIcon';

import CHILDREN_COMPONENTS from './definition';
import type {ChildExtendedDetails} from './types';

export interface ChildrenComponentProps {
  childrenValues: ChildExtendedDetails[];
  enableCreation: boolean;
  enableSelection: boolean;
  onAddChild: () => void;
  onEditChild: (child: ChildExtendedDetails) => void;
  onRemoveChild: (child: ChildExtendedDetails) => void;
  toggleChildSelection: (childId: UUID) => void;
}

/**
 * Root children component - it binds with the Formio component.
 *
 * This component manages the data/preview and necessary controls given the Formio
 * state.
 */
export const ChildrenComponent: React.FC<ChildrenComponentProps> = ({
  childrenValues,
  enableCreation,
  enableSelection,
  onAddChild,
  onEditChild,
  onRemoveChild,
  toggleChildSelection,
}) => (
  <>
    <DisplayChildren
      childrenValues={childrenValues}
      enableSelection={enableSelection}
      onEditChild={onEditChild}
      onRemoveChild={onRemoveChild}
      toggleChildSelection={toggleChildSelection}
    />
    {enableCreation && (
      <OFButton onClick={onAddChild} variant="secondary" appearance="primary-action-button">
        <FormattedMessage
          description="Add child: add child button text"
          defaultMessage="Add Child"
        />
      </OFButton>
    )}
  </>
);

export interface DisplayChildrenProps {
  childrenValues: ChildExtendedDetails[];
  enableSelection: boolean;
  onEditChild: (child: ChildExtendedDetails) => void;
  onRemoveChild: (child: ChildExtendedDetails) => void;
  toggleChildSelection: (childId: UUID) => void;
}

export const DisplayChildren: React.FC<DisplayChildrenProps> = ({
  childrenValues,
  enableSelection,
  onEditChild,
  onRemoveChild,
  toggleChildSelection,
}) => {
  const intl = useIntl();

  const childrenFields = CHILDREN_COMPONENTS.map(({key, label}) => ({
    name: key,
    label: label,
  }));

  return (
    <div className="openforms-children">
      {childrenValues.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              {enableSelection && <TableHeaderCell key="checkbox" />}
              {childrenFields.map(({name, label}) => (
                <TableHeaderCell key={name}>
                  <FormattedMessage {...label} />
                </TableHeaderCell>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {childrenValues.map((child, index) => (
              <TableRow key={index}>
                {enableSelection && (
                  <TableCell>
                    <Checkbox
                      name={`child.${index}`}
                      checked={!!child.selected}
                      onChange={() => toggleChildSelection(child.__id)}
                    />
                  </TableCell>
                )}
                <TableCell>
                  {child.bsn || (
                    <i>
                      <FormattedMessage
                        description="Emtpy field message"
                        defaultMessage="No information provided"
                      />
                    </i>
                  )}
                </TableCell>
                <TableCell>
                  {child.firstNames || (
                    <i>
                      <FormattedMessage
                        description="Emtpy field message"
                        defaultMessage="No information provided"
                      />
                    </i>
                  )}
                </TableCell>
                <TableCell>
                  {child.dateOfBirth || (
                    <i>
                      <FormattedMessage
                        description="Emtpy field message"
                        defaultMessage="No information provided"
                      />
                    </i>
                  )}
                </TableCell>
                {child.__addedManually && (
                  <TableCell className="openforms-children__actions">
                    <OFButton
                      onClick={() => onEditChild(child)}
                      appearance="subtle-button"
                      variant="default"
                      aria-label={intl.formatMessage(
                        {
                          description: 'Edit child button [bsn]',
                          defaultMessage: 'Edit child with BSN: {bsn}.',
                        },
                        {bsn: child.bsn}
                      )}
                    >
                      <Icon>
                        <FAIcon icon="pen" />
                      </Icon>
                    </OFButton>
                    <OFButton
                      onClick={() => onRemoveChild(child)}
                      appearance="subtle-button"
                      variant="default"
                      hint="danger"
                      aria-label={intl.formatMessage(
                        {
                          description: 'Delete child button [bsn]',
                          defaultMessage: 'Delete child with BSN: {bsn}.',
                        },
                        {bsn: child.bsn}
                      )}
                    >
                      <Icon>
                        <FAIcon icon="trash-can" />
                      </Icon>
                    </OFButton>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default ChildrenComponent;
