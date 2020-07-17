import {ModelsBase} from './models.base';
import {AnyObject} from '../../../../../../types/globals';

export class PartnerStaffMember {
  id: number | null = null;
  name?: string;
  first_name = '';
  last_name = '';
  active = true;
  title = '';
  email = '';
  phone = '';
}
