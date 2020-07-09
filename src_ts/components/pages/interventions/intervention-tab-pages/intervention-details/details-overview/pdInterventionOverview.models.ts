import {ModelsBase} from '../../common/models/models.base';
import {Intervention} from '../../common/models/intervention-types';

// @lajos TO DO: refactor bellow so that data is populated(wait PR to be merged from Dan and him to test his code)

export class PdInterventionOverview extends ModelsBase {
  constructor(intervention: Intervention) {
    super();
    this.setObjProperties(intervention);
  }
  document_type = '';
  cfei_number = '';
  contingency_pd = false;
  humanitarian = false;
}
