import {GenericObject} from '@unicef-polymer/etools-types';
import {get as getTranslation} from 'lit-translate';

export const DRAFT = 'draft';
export const SUBMITTED = 'submitted';
export const PENDING = 'pending';
export const APPROVED = 'approved';
export const REJECTED = 'rejected';
export const CLOSED = 'closed';
export const CANCELLED = 'cancelled';
export const EFACE_STATUSES = {
  [DRAFT]: [DRAFT, 'Draft'],
  [SUBMITTED]: [SUBMITTED, 'Submitted'],
  [PENDING]: [PENDING, 'Pending (in vision)'],
  [APPROVED]: [APPROVED, 'Approved'],
  [REJECTED]: [REJECTED, 'Rejected'],
  [CLOSED]: [CLOSED, 'Closed'],
  [CANCELLED]: [CANCELLED, 'Cancelled']
};

export const BASIC_STATUSES = [
  EFACE_STATUSES[DRAFT],
  EFACE_STATUSES[SUBMITTED],
  EFACE_STATUSES[PENDING],
  EFACE_STATUSES[APPROVED]
];
export const REJECTED_STATUSES = [...BASIC_STATUSES];
REJECTED_STATUSES.splice(1, 0, EFACE_STATUSES[REJECTED]);
export const CLOSED_STATUSES = [...BASIC_STATUSES];
CLOSED_STATUSES.splice(3, 1, EFACE_STATUSES[CLOSED]);
export const CANCELLED_STATUSES = [EFACE_STATUSES[CANCELLED]];

export const REJECT = 'reject';
export const CANCEL = 'cancel';
export const SUBMIT = 'submit';
export const SEND_TO_VISION = 'send_to_vision';
export const TRANSACTION_APPROVE = 'transaction_approve';
export const TRANSACTION_REJECT = 'transaction_reject';

export const BACK_ACTIONS = [REJECT];
export const ACTIONS_WITH_INPUT = [CANCEL, REJECT, TRANSACTION_REJECT];

export const namesMap: GenericObject<string> = {
  [CANCEL]: getTranslation('GENERAL.CANCEL'),
  [SUBMIT]: getTranslation('SUBMIT'),
  [TRANSACTION_REJECT]: getTranslation('EFACE_ACTIONS_CONFIRMATIONS.TRANSACTION_REJECT'),
  [TRANSACTION_APPROVE]: getTranslation('EFACE_ACTIONS_CONFIRMATIONS.TRANSACTION_APPROVE')
};

export const ActionToStatus = new Map([
  [REJECT, 'rejected'],
  [CANCEL, 'cancelled'],
  [SUBMIT, 'submitted'],
  [SEND_TO_VISION, 'pending'],
  [TRANSACTION_APPROVE, 'approved'],
  [TRANSACTION_REJECT, 'closed']
]);
