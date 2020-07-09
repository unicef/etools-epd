import {ModelsBase} from '../../common/models/models.base';
import {PlannedBudget} from '../../common/models/intervention-types';

// @lajos TO DO: check exactly where the values come from
export class PdBudgetSummary extends ModelsBase {
  constructor(plannedBudget: PlannedBudget) {
    super();
    this.setObjProperties(plannedBudget);
  }
  currency!: string;
  hq_rate!: string;
  prgm_effectiveness!: boolean;
  total_cso!: boolean;
  total_unicef!: string;
  total_supply!: string;
  partner_contrib!: boolean;
  total_cash!: boolean;
  total_amt!: boolean;
}
