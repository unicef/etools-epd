import {css} from 'lit';

// language=CSS
export const labelAndvalueStylesLit = css`
  .label {
    font-size: var(--etools-font-size-12, 12px);
    color: var(--secondary-text-color);
    padding-top: 6px;
  }

  .input-label {
    min-height: 24px;
    padding-top: 4px;
    padding-bottom: 6px;
    min-width: 0;
    font-size: var(--etools-font-size-16, 16px);
  }

  .input-label[empty]::after {
    content: '—';
    color: var(--secondary-text-color);
  }
`;
