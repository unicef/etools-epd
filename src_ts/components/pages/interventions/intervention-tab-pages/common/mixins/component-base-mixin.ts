import {LitElement, property, html} from 'lit-element';
import {Constructor, AnyObject} from '../models/globals.types';
import EtoolsDialog from '@unicef-polymer/etools-dialog/etools-dialog';
import {createDynamicDialog, removeDialog} from '@unicef-polymer/etools-dialog/dynamic-dialog';
import {fireEvent} from '../../../../../utils/fire-custom-event';
import {sendRequest} from '@unicef-polymer/etools-ajax/etools-ajax-request';
import {copy} from '../../utils/utils';

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

    @property({type: String})
    deleteConfirmationTitle = 'Delete confirmation';

    @property({type: String})
    deleteConfirmationMessage = 'Are you sure you want to delete this item?';

    @property({type: String})
    deleteActionLoadingMsg = 'Deleting items from server...';

    @property({type: String})
    deleteLoadingSource = 'delete-data-set';

    @property({type: String})
    deleteActionDefaultErrMsg = 'Deleting items from server action has failed!';

    @property({type: Array})
    dataItems!: any[];

    private _deleteDialog!: EtoolsDialog;
    private elToDeleteIndex!: number;

    public _openDeleteConfirmation(event: any) {
      event.stopPropagation();
      if (!this.editMode) {
        return;
      }
      this.elToDeleteIndex = parseInt(event.target.getAttribute('data-args'), 10);
      this._deleteDialog.opened = true;
    }

    public _createDeleteConfirmationDialog() {
      const deleteConfirmationContent = document.createElement('div');
      deleteConfirmationContent.innerHTML = this.deleteConfirmationMessage;
      this._onDeleteConfirmation = this._onDeleteConfirmation.bind(this);

      this._deleteDialog = createDynamicDialog({
        title: this.deleteConfirmationTitle,
        size: 'md',
        okBtnText: 'Yes',
        cancelBtnText: 'No',
        closeCallback: this._onDeleteConfirmation,
        content: deleteConfirmationContent
      });
    }

    public _onDeleteConfirmation(event: any) {
      this._deleteDialog.opened = false;
      if (event.detail.confirmed === true) {
        const id = this.dataItems[this.elToDeleteIndex] ? this.dataItems[this.elToDeleteIndex].id : null;

        if (id) {
          // @ts-ignore
          if (!this._deleteEpName) {
            // logError('You must define _deleteEpName property to be able to remove existing records');
            return;
          }

          fireEvent(this, 'global-loading', {
            message: this.deleteActionLoadingMsg,
            active: true,
            loadingSource: this.deleteLoadingSource
          });

          // @ts-ignore
          let endpointParams = {id: id};
          // @ts-ignore
          if (this.extraEndpointParams) {
            // @ts-ignore
            endpointParams = {...endpointParams, ...this.extraEndpointParams};
          }
          // @ts-ignore
          const deleteEndpoint = this.getEndpoint(this._deleteEpName, endpointParams);
          sendRequest({
            method: 'DELETE',
            endpoint: deleteEndpoint,
            body: {}
          })
            .then((_resp: any) => {
              this._handleDeleteResponse();
            })
            .catch((error: any) => {
              this._handleDeleteError(error.response);
            });
        } else {
          this._deleteElement();
          this.elToDeleteIndex = -1;
        }
      } else {
        this.elToDeleteIndex = -1;
      }
    }

    public _handleDeleteResponse() {
      this._deleteElement();
      this.elToDeleteIndex = -1;
      fireEvent(this, 'global-loading', {
        active: false,
        loadingSource: this.deleteLoadingSource
      });
    }

    public _handleDeleteError(responseErr: any) {
      fireEvent(this, 'global-loading', {
        active: false,
        loadingSource: this.deleteLoadingSource
      });

      let msg = this.deleteActionDefaultErrMsg;
      if (responseErr instanceof Array && responseErr.length > 0) {
        msg = responseErr.join('\n');
      } else if (typeof responseErr === 'string') {
        msg = responseErr;
      }
      fireEvent(this, 'toast', {text: msg, showCloseBtn: true});
    }

    public _deleteElement() {
      if (!this.editMode) {
        return;
      }
      const index = this.elToDeleteIndex;
      if (index !== null && typeof index !== 'undefined' && index !== -1) {
        this.splice('dataItems', index, 1);

        // To mke sure all req. observers are triggered
        this.dataItems = copy(this.dataItems);

        fireEvent(this, 'delete-confirm', {index: this.elToDeleteIndex});
      }
    }

    /**
     * selValue - the just selected value or id
     * selIndex - the index of the selected data item
     * itemValueName - the name of property to compare selValue against
     */
    public isAlreadySelected(selValue: any, selIndex: any, itemValueName: any) {
      const duplicateItems = this.dataItems.filter(function (item, index) {
        return parseInt(item[itemValueName]) === parseInt(selValue) && parseInt(String(index)) !== parseInt(selIndex);
      });
      return duplicateItems && duplicateItems.length;
    }

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

    public _emptyList(listLength: number) {
      return listLength === 0;
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
      if (!detail.selectedItem) {
        return;
      }
      this.dataToSave[key] = detail.selectedItem?.id;
    }

    selectedItemsChanged(detail: any, key: string, optionValue?: string) {
      if (!detail.selectedItems) {
        return;
      }
      this.dataToSave[key] = detail.selectedItems.map((i: any) => (optionValue ? i[optionValue] : i.id));
    }

    valueChanged(detail: any, key: string) {
      this.dataToSave[key] = detail.value;
    }
  }
  return ComponentBaseClass;
}

export default ComponentBaseMixin;
