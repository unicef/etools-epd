// @lajos: tobe checked if correct
import {interventionEndpoints} from '../../utils/intervention-endpoints';
// @lajos: to check the rootState, for uploadStatus
import {getStore} from '../../utils/redux-store-access';
import {DECREASE_UNSAVED_UPLOADS, INCREASE_UPLOADS_IN_PROGRESS} from '../../utils/upload-status';
import {Constructor} from '../models/globals.types';
import {LitElement, property} from 'lit-element';
/**
 * @polymer
 * @mixinFunction
 */
function UploadsMixin<T extends Constructor<LitElement>>(baseClass: T) {
  class UploadsClass extends baseClass {
    // to be checked if OK
    @property({type: String})
    uploadEndpoint = interventionEndpoints.attachmentsUpload.url;

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
