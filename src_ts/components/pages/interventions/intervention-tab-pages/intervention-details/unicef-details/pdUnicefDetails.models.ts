import {ModelsBase} from '../../common/models/models.base';
import {InterventionPermissionsFields, Intervention} from '../../common/models/intervention-types';

export class PdUnicefDetails extends ModelsBase {
  constructor(intervention: Intervention) {
    super();
    this.setObjProperties(intervention);
  }
  document_type!: string;
  offices!: [];
  sections!: [];
  clusters!: [];
  unicef_focal_points!: [];
  unicef_budget_owner!: string;
  focal_point_list!: [];
  office_list!: [];
  section_list!: [];
  cluster_list!: [];
  budget_owner_list!: [];
}

export class PdUnicefDetailsPermissions extends ModelsBase {
  constructor(permissions: InterventionPermissionsFields) {
    super();
    this.setObjProperties(permissions);
  }
  unicef_office = true;
  sections = true;
  focal_points = true;
  budget_owner = true;
}
