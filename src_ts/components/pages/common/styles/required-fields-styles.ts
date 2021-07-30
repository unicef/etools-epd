import {html} from 'lit-element';

export const RequiredFieldsStyles = html`
  <style>
    paper-input[required][label],
    paper-textarea[required][label],
    paper-input-container[required],
    datepicker-lite[required],
    etools-upload[required],
    etools-currency-amount-input[required] {
      --paper-input-container-label: {
        @apply --required-star-style;
        color: var(--secondary-text-color, #737373);
      }
      --paper-input-container-label-floating: {
        @apply --required-star-style;
        color: var(--secondary-text-color, #737373);
      }
    }

    etools-dropdown-multi[required]::part(esmm-label),
    etools-dropdown[required]::part(esmm-label) {
      @apply --required-star-style;
    }

    label[required] {
      @apply --required-star-style;
      background: url('./images/required.svg') no-repeat 87% 40%/6px;
    }
  </style>
`;
