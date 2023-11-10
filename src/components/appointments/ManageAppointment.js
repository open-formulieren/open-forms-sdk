import React from 'react';
import {Route, Routes} from 'react-router-dom';

import ErrorBoundary from 'components/Errors/ErrorBoundary';

import {CancelAppointment, CancelAppointmentSuccess} from './cancel';

// with react router v6, these routes can be hoisted into the App if we'd like to

const ManageAppointment = () => {
  return (
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
  );
};

export default ManageAppointment;
