import {ModelsBase} from '../../common/models/models.base';
import {PlannedBudget} from '../../common/models/intervention-types';

// @lajos TO DO: check exactly where the values come from
// @lajos TO DO more: check with backend where the values are stored!!!!
export class BudgetSummary extends ModelsBase {
  constructor(plannedBudget: PlannedBudget) {
    super();
    this.setObjProperties(plannedBudget);
  }
  currency = '';
  hq_rate = '';
  prgm_effectiveness = '';
  total_cso = '';
  total_unicef = '';
  total_supply = '';
  partner_contrib = '';
  total_cash = '';
  total_amt = '';
}
