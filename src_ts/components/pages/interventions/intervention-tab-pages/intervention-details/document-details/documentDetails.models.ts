import {ModelsBase} from '../../common/models/models.base';
import {InterventionPermissionsFields, Intervention} from '../../common/models/intervention-types';

export class DocumentDetails extends ModelsBase {
  constructor(intervention: Intervention) {
    super();
    this.setObjProperties(intervention);
  }
  title!: string;
  context!: string;
  implementation_strategy!: string;
  ip_progr_contrib!: string;
}

export class DocumentDetailsPermissions extends ModelsBase {
  constructor(permissions: InterventionPermissionsFields) {
    super();
    this.setObjProperties(permissions);
  }
  title!: true;
  context!: true;
  implementation_strategy!: true;
  ip_progr_contrib!: true;
}
