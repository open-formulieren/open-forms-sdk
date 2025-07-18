import {Checkbox} from '@utrecht/component-library-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from '@utrecht/component-library-react';
import '@utrecht/table-css';
import {FormattedMessage} from 'react-intl';

import FAIcon from 'components/FAIcon';

import {OFButton} from '@/components/Button';

import CHILDREN_COMPONENTS from './definition';
import {ChildExtendedDetails} from './types';

export interface ChildrenComponentProps {
  childrenValues: ChildExtendedDetails[];
  hasNoChildren: boolean;
  manuallyAddedChild: boolean;
  enableSelection: boolean;
  onAddChild: () => void;
  onEditChild: () => void;
  onRemoveChild: () => void;
  toggleChildSelection: (childBSN: string) => void;
}

/**
 * Root children component - it binds with the Formio component.
 *
 * This component manages the data/preview and necessary controls given the Formio
 * state.
 */
export const ChildrenComponent: React.FC<ChildrenComponentProps> = ({
  childrenValues,
  hasNoChildren,
  manuallyAddedChild,
  enableSelection,
  onAddChild,
  onEditChild,
  onRemoveChild,
  toggleChildSelection,
}) => (
  <>
    <DisplayChildren
      childrenValues={childrenValues}
      manuallyAddedChild={manuallyAddedChild}
      enableSelection={enableSelection}
      onEditChild={onEditChild}
      onRemoveChild={onRemoveChild}
      toggleChildSelection={toggleChildSelection}
    />
    {(hasNoChildren || manuallyAddedChild) && (
      <OFButton onClick={onAddChild} variant="primary" appearance="primary-action-button">
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
  manuallyAddedChild: boolean;
  enableSelection: boolean;
  onEditChild: (child: ChildExtendedDetails) => void;
  onRemoveChild: (child: ChildExtendedDetails) => void;
  toggleChildSelection: (childBSN: string) => void;
}

export const DisplayChildren: React.FC<DisplayChildrenProps> = ({
  childrenValues,
  manuallyAddedChild,
  enableSelection,
  onEditChild,
  onRemoveChild,
  toggleChildSelection,
}) => {
  const childrenFields = CHILDREN_COMPONENTS.map(({key, label}) => ({
    name: key,
    label: label,
  }));

  return (
    <div style={{padding: '1em'}}>
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
                      checked={!!child.__selected}
                      onClick={() => toggleChildSelection(child.bsn)}
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
                {manuallyAddedChild && (
                  <TableCell>
                    <OFButton
                      onClick={() => onEditChild(child)}
                      appearance="subtle-button"
                      variant="default"
                    >
                      <FAIcon icon="pen" />
                    </OFButton>
                    <OFButton
                      onClick={() => onRemoveChild(child)}
                      appearance="subtle-button"
                      variant="default"
                      hint="danger"
                    >
                      <FAIcon icon="trash-can" />
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
