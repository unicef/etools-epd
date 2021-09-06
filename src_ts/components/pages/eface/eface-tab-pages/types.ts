import {Intervention, User} from '@unicef-polymer/etools-types';

export class EfaceItem {
  pd_activity: string | null = '';
  eepm_kind = '';
  description = '';
  reporting_authorized_amount: string | null = null;
  reporting_actual_project_expenditure: string | null = null;
  reporting_expenditures_accepted_by_agency: string | null = null;
  reporting_balance: string | null = null;
  requested_amount: string | null = null;
  requested_authorized_amount: string | null = null;
  requested_outstanding_authorized_amount = null;
  kind = '';
  [key: string]: any;
}
export class Eface {
  activities: EfaceItem[] = [];
  intervention!: Intervention;
  actions_available!: string[];
  authorized_amount_date_end!: null | string;
  authorized_amount_date_start!: null | string;
  cancel_reason!: string;
  date_approved!: string;
  date_cancelled!: string;
  date_closed!: string;
  date_pending!: string;
  date_rejected!: string;
  date_submitted!: string;
  expenditures_disbursed!: boolean;
  currency!: string;
  id!: number;
  notes!: string;
  permissions!: any;
  reference_number!: string;
  rejection_reason!: string;
  reporting_actual_project_expenditure!: string;
  reporting_authorized_amount!: string;
  reporting_balance!: string;
  reporting_expenditures_accepted_by_agency!: string;
  request_represents_expenditures!: boolean;
  request_type!: string;
  requested_amount!: string;
  requested_amount_date_end!: null | string;
  requested_amount_date_start!: null | string;
  requested_authorized_amount!: string;
  requested_outstanding_authorized_amount!: string;
  status!: string;
  submitted_by!: User;
  submitted_by_unicef_date!: null | string;
  title!: string;
  transaction_rejection_reason!: string;
  [key: string]: any;
}
