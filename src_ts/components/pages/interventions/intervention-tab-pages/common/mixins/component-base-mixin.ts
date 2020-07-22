import {LitElement, property, html} from 'lit-element';
import {Constructor, AnyObject} from '../types/types';

function ComponentBaseMixin<T extends Constructor<LitElement>>(baseClass: T) {
  class ComponentBaseClass extends baseClass {
    @property({type: Boolean})
    editMode = false;

    @property({type: Boolean})
    canEditAtLeastOneField = false;

    @property({type: Object})
    originalData!: any;

    @property({type: Object})
    dataToSave: any = {};

    @property({type: Object})
    permissions!: any;

    set_canEditAtLeastOneField(editPermissions: AnyObject) {
      this.canEditAtLeastOneField = Object.keys(editPermissions).some((key: string) => editPermissions[key] === true);
    }

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

    cancel() {
      throw new Error('Not implemented');
    }

    save() {
      throw new Error('Not implemented');
    }

    renderActions(editMode: boolean, canEditAnyFields: boolean) {
      return this.hideActionButtons(editMode, canEditAnyFields)
        ? html``
        : html`
            <div class="layout-horizontal right-align row-padding-v">
              <paper-button class="default" @tap="${this.cancel}">
                Cancel
              </paper-button>
              <paper-button class="primary" @tap="${this.save}">
                Save
              </paper-button>
            </div>
          `;
    }

    renderEditBtn(editMode: boolean, canEditAnyFields: boolean) {
      return this.hideEditIcon(editMode, canEditAnyFields)
        ? html``
        : html` <paper-icon-button @tap="${this.allowEdit}" icon="create"> </paper-icon-button> `;
    }

    renderNameEmailPhone(item: any) {
      return html`${item.first_name} ${item.last_name} (${item.email}, ${item.phone})`;
    }

    selectedItemChanged(detail: any, key: string) {
      this.dataToSave[key] = detail.selectedItem?.id;
    }

    selectedItemsChanged(detail: any, key: string) {
      this.dataToSave[key] = detail.selectedItems.map((i: any) => i.id);
    }
  }
  return ComponentBaseClass;
}

export default ComponentBaseMixin;
