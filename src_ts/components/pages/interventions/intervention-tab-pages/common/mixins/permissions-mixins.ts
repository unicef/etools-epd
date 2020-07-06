import {LitElement} from 'lit-element';
import {Constructor} from '../types/types';

function PermissionsMixin<T extends Constructor<LitElement>>(baseClass: T) {
  class PermissionsClass extends baseClass {
    hideEditIcon(editMode: boolean, canEdit: boolean) {
      return !canEdit || editMode;
    }

    hideActionButtons(editMode: boolean, canEdit: boolean) {
      if (!canEdit) {
        return true;
      }

      return !editMode;
    }

    isReadonly(editMode: boolean, canEdit: boolean) {
      return !(editMode && canEdit);
    }
  }
  return PermissionsClass;
}

export default PermissionsMixin;
