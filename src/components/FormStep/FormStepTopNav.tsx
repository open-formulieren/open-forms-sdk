export interface FormStepTopNavProps {
  children: React.ReactNode;
}

/**
 * UI elements displayed on top of/above a form step.
 *
 * Note that some child element visibility may be controlled through design tokens.
 */
const FormStepTopNav: React.FC<FormStepTopNavProps> = ({children}) => {
  return <div className="openforms-step-topnav">{children}</div>;
};

export default FormStepTopNav;
