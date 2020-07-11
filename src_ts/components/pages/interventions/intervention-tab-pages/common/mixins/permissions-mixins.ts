import {LitElement, property} from 'lit-element';
import {Constructor} from '../../utils/types';

function PermissionsMixin<T extends Constructor<LitElement>>(baseClass: T) {
  class PermissionsClass extends baseClass {
    @property({type: Boolean})
    editMode = false;

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

    allowEdit() {
      this.editMode = true;
    }
  }
  return PermissionsClass;
}

export default PermissionsMixin;
