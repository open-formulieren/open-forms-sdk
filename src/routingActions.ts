interface CosignInit {
  action: 'cosign-init';
  params: {
    code: string;
  };
}

interface Cosign {
  action: 'cosign';
  params: {
    submission_uuid: string;
  };
}

interface CancelAppointment {
  action: 'afspraak-annuleren';
  params: {
    submission_uuid: string;
    time: string;
  };
}

interface CreateAppointment {
  action: 'afspraak-maken';
  params: null;
}

interface Resume {
  action: 'resume';
  params: {
    submission_uuid: string;
    step_slug: string;
  };
}

interface Payment {
  action: 'payment';
  params: {
    of_payment_status: string;
    of_payment_id: string;
    of_payment_action: string;
    of_submission_status: string;
  };
}

export type Action = CosignInit | Cosign | CancelAppointment | CreateAppointment | Resume | Payment;

interface RedirectParams {
  path: string;
  query?: URLSearchParams;
}

/**
 * Get the correct redirect path for an action.
 */
export const getRedirectParams = ({action, params}: Action): RedirectParams => {
  switch (action) {
    case 'cosign-init': {
      return {
        path: 'cosign/start',
        query: new URLSearchParams(params),
      };
    }
    case 'cosign':
      return {
        path: 'cosign/check',
        query: new URLSearchParams(params),
      };
    case 'afspraak-annuleren':
      return {
        path: 'afspraak-annuleren',
        query: new URLSearchParams(params),
      };
    case 'afspraak-maken':
      return {path: 'afspraak-maken'};
    case 'resume':
      return {
        path: `stap/${params.step_slug}`,
        query: new URLSearchParams({submission_uuid: params.submission_uuid}),
      };
    case 'payment':
      return {
        path: 'betalen',
        query: new URLSearchParams(params),
      };
    default: {
      const exhaustiveCheck: never = action;
      throw new Error(`Action ${exhaustiveCheck} is not handled.`);
    }
  }
};
