import {css} from 'lit-element';

export const materialUIifyDuetDatePicker = css`
  duet-date-picker .duet-date__input {
    padding: 3px 0px 3px 3px;
    border: none;
    border-radius: 0;
    border-bottom: 1px solid var(--secondary-text-color);
  }

  duet-date-picker .duet-date__toggle {
    background: transparent;
    box-shadow: none;
  }
`;
