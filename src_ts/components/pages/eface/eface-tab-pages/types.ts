import {Intervention} from '@unicef-polymer/etools-types';

export class EfaceItem {
  pd_activity: string | null = '';
  eepm_kind = '';
  description = '';
  reporting_authorized_amount = null;
  reporting_actual_project_expenditure = null;
  reporting_expenditures_accepted_by_agency = null;
  reporting_balance = null;
  requested_amount = null;
  requested_authorized_amount = null;
  requested_outstanding_authorized_amount = null;
  kind = '';
}
export class Eface {
  id: string | null = null;
  activities: EfaceItem[] = [];
  intervention!: Intervention;

  total_reporting_authorized_amount: number | null = null;
  total_reporting_actual_project_expenditure: number | null = null;
  total_reporting_expenditures_accepted_by_agency = null;
  total_reporting_balance = null;
  total_requested_amount: number | null = null;
  total_requested_authorized_amount: string | null = null;
  total_requested_outstanding_authorized_amount = null;
}
