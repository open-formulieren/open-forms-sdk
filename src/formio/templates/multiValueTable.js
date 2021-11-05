import { applyPrefix } from '../utils';

const TEMPLATE = `
<table class="${applyPrefix('multi-value-table')}">
  <tbody>
  {{ctx.rows}}
  {% if (!ctx.disabled) {%}
    <tr>
      <td colspan="2">
        <button class="${applyPrefix('button')}" ref="addButton">
          <i class="{{ctx.iconClass('plus')}}"></i>
          <div class="${applyPrefix('multi-value-table')}__button-label">{{ctx.t(ctx.addAnother, {_userInput: true})}}</div>
        </button>
      </td>
    </tr>
  {%} %}
  </tbody>
</table>
`;

export default TEMPLATE;
