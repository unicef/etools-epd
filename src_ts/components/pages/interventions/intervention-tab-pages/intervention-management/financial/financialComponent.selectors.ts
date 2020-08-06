import {ModelsBase} from '../../common/models/models.base';
import {InterventionPermissionsFields, Intervention} from '../../common/models/intervention.types';

export class FinancialComponentData extends ModelsBase {
  constructor(intervention: Intervention) {
    super();
    this.setObjProperties(intervention);
  }
  document_type = '';
  headquarters_contribution_direct_cash = false;
  headquarters_contribution_direct_payment = false;
  headquarters_contribution_reimbursement = false;
  cash_transfer_modalities = '';
}

export class FinancialComponentPermissions extends ModelsBase {
  constructor(permissions: InterventionPermissionsFields) {
    super();
    this.setObjProperties(permissions);
  }
  cash_transfer_modalities = true;
  headquarters_contribution = true;
}
