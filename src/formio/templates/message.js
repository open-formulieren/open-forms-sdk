import { applyPrefix } from '../utils';

const TEMPLATE = `
<div class="${applyPrefix('message')} ${applyPrefix('message--{{ctx.level}}')}">
  {{ctx.message}}
</div>
`;

export default TEMPLATE;
