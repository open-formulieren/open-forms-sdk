import React from 'react';
import {Route, Routes} from 'react-router-dom';

import ErrorBoundary from 'components/ErrorBoundary';
import {LayoutColumn} from 'components/Layout';

import CancelAppointment from './CancelAppointment';
import CancelAppointmentSuccess from './CancelAppointmentSuccess';

// with react router v6, these routes can be hoisted into the App if we'd like to

const ManageAppointment = () => {
  return (
    <LayoutColumn modifiers={['mobile-order-2', 'mobile-padding-top']}>
      <Routes>
        <Route
          path=""
          element={
            <ErrorBoundary>
              <CancelAppointment />
            </ErrorBoundary>
          }
        />
        <Route path="succes" element={<CancelAppointmentSuccess />} />
      </Routes>
    </LayoutColumn>
  );
};

export default ManageAppointment;
