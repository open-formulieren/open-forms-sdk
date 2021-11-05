import { applyPrefix } from '../utils';

const TEMPLATE = `
<tr class="${applyPrefix('multi-value-row')}" ref="row">
  <td class="${applyPrefix('multi-value-row')}__input">
    {{ctx.element}}
  </td>
  {% if (!ctx.disabled) { %}
  <td class="${applyPrefix('multi-value-row')}__remove">
      <i class="{{ctx.iconClass('remove')}}" ref="removeRow"></i>
  </td>
  {% } %}
</tr>
`;

export default TEMPLATE;
