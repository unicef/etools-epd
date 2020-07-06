import pick from 'lodash-es/pick';
import {Intervention, InterventionPermissionsFields} from './intervention-types';
import {AnyObject} from '../types/types';

export class ModelsBase {
  setObjProperties(dataSource: Intervention | InterventionPermissionsFields) {
    Object.assign(this, pick(dataSource, Object.keys(this as AnyObject)));
  }
}
