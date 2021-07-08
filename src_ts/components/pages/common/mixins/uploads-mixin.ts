import {LitElement, property} from 'lit-element';
import {getEndpoint} from '../utils/endpoint-helper';
import {interventionEndpoints} from '../utils/intervention-endpoints';
import {Constructor} from '@unicef-polymer/etools-types';
import {getStore} from '../utils/redux-store-access';
import {
  DECREASE_UNSAVED_UPLOADS,
  INCREASE_UPLOADS_IN_PROGRESS
} from '../../interventions/intervention-tab-pages/common/actions/actionsContants';

/**
 * @polymer
 * @mixinFunction
 */
function UploadsMixin<T extends Constructor<LitElement>>(baseClass: T) {
  class UploadsClass extends baseClass {
    @property({type: String})
    uploadEndpoint: string = getEndpoint(interventionEndpoints.attachmentsUpload).url;

    @property({type: Number})
    uploadsInProgress!: number;

    @property({type: Number})
    unsavedUploads!: number;

    uploadsStateChanged(state: any) {
      if (state.uploadStatus!.unsavedUploads !== this.unsavedUploads) {
        this.unsavedUploads = state.uploadStatus!.unsavedUploads;
      }

      if (state.uploadStatus!.uploadsInProgress !== this.uploadsInProgress) {
        this.uploadsInProgress = state.uploadStatus!.uploadsInProgress;
      }
    }

    public _onUploadStarted(e: any) {
      e.stopImmediatePropagation();
      getStore().dispatch({type: INCREASE_UPLOADS_IN_PROGRESS});
    }

    public _onChangeUnsavedFile(e: any) {
      e.stopImmediatePropagation();
      getStore().dispatch({type: DECREASE_UNSAVED_UPLOADS});
    }
  }
  return UploadsClass;
}

export default UploadsMixin;
