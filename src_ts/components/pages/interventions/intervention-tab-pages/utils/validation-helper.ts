import {LitElement} from 'lit-element';
import {PolymerElement} from '@polymer/polymer';

type ValidatableElement = (LitElement | PolymerElement) & {validate(): boolean};

export const validateRequiredFields = (element: LitElement | PolymerElement) => {
  let isValid = true;
  element!.shadowRoot!.querySelectorAll<ValidatableElement>('[required]').forEach((el) => {
    if (el && el.validate && !el.validate()) {
      isValid = false;
    }
  });
  return isValid;
};
