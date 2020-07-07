import {InterventionPermissionsFields, Intervention} from '../../common/models/intervention-types';
import {ModelsBase} from '../../common/models/models.base';

export class PartnerDetails extends ModelsBase {
  constructor(intervention: Intervention) {
    super();
    this.setObjProperties(intervention);
  }
  partner!: number;
  partner_name!: string;
}

export class PartnerDetailsPermissions extends ModelsBase {
  constructor(permissions: InterventionPermissionsFields) {
    super();
    this.setObjProperties(permissions);
  }
  partner!: boolean;
  // TODO -add rest of props
}
