import {Intervention} from '@unicef-polymer/etools-types';

export class EfaceItem {
  pd_activity: string | null = '';
  eepm_kind = '';
  description = '';
  reporting_authorized_amount = '0';
  reporting_actual_project_expenditure = '0';
  reporting_expenditures_accepted_by_agency = '0';
  reporting_balance = '0';
  requested_amount = '0';
  requested_authorized_amount = '0';
  requested_outstanding_authorized_amount = '0';
  kind = '';
}
export class Eface {
  id: string | null = null;
  activities: EfaceItem[] = [];
  intervention!: Intervention;
}
