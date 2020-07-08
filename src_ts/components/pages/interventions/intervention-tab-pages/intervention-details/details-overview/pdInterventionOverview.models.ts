import {ModelsBase} from '../../common/models/models.base';
import {Intervention} from '../../common/models/intervention-types';

export class PdInterventionOverview extends ModelsBase {
  constructor(intervention: Intervention) {
    super();
    this.setObjProperties(intervention);
  }
  document_type!: string;
  cfei_number!: string;
  contingency_pd!: boolean;
  humanitarian!: boolean;
}
