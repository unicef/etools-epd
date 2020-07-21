import {ModelsBase} from '../../common/models/models.base';
import {InterventionPermissionsFields, Intervention} from '../../common/models/intervention-types';
import {AnyObject} from '../../common/types/types';

export class Locations extends ModelsBase {
  constructor(intervention: Intervention) {
    super();
    this.setObjProperties(intervention);
  }
  locations: AnyObject[] = [];
}

export class LocationsPermissions extends ModelsBase {
  constructor(permissions: InterventionPermissionsFields) {
    super();
    this.setObjProperties(permissions);
  }
  locations = true;
}
export interface AdminLevel {
  id: number;
  name: string;
  admin_level: string | null;
  created: string;
  modified: string;
}
