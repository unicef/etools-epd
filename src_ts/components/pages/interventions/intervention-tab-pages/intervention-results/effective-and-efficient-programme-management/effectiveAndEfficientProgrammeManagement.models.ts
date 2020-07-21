import {InterventionPermissionsFields, Intervention} from '../../common/models/intervention.types';
import {ModelsBase} from '../../common/models/models.base';

export class ProgrammeManagement extends ModelsBase {
  constructor(intervention: Intervention) {
    super();
    this.setObjProperties(intervention);
  }
  activities = [];
  total_amount: number | null = null;
}

export class ProgrammeManagementPermissions extends ModelsBase {
  constructor(permissions: InterventionPermissionsFields) {
    super();
    this.setObjProperties(permissions);
  }
  activities = false;
  total_amount = false;
}
