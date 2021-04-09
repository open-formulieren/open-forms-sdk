import React from 'react';
import PropTypes from 'prop-types';


/**
 * An OpenForms form.
 *
 * OpenForms forms consist of some metadata and individual steps.
 * @param  {Object} options.form The form definition from the Open Forms API
 * @return {JSX}
 */
const Form = ({ form }) => {
    return (
        <>I am a form!</>
    );
};

Form.propTypes = {
    form: PropTypes.shape({
        uuid: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        loginRequired: PropTypes.bool.isRequired,
        product: PropTypes.object,
        slug: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
        steps: PropTypes.arrayOf(PropTypes.shape({
            uuid: PropTypes.string.isRequired,
            formDefinition: PropTypes.string.isRequired,
            index: PropTypes.number.isRequired,
            url: PropTypes.string.isRequired,
        })).isRequired,
    }).isRequired,
};


export { Form };
