import { applyPrefix } from '../utils';

const TEMPLATE = `
{% if (!ctx.label.hidden && ctx.label.labelPosition !== 'bottom') { %}
  {{ ctx.labelMarkup }}
{% } %}

{% if (ctx.label.hidden && ctx.label.className && ctx.component.validate.required) { %}
  <label class="${applyPrefix('label')} {{ctx.label.className}}"></label>
{% } %}

{{ctx.element}}

{% if (!ctx.label.hidden && ctx.label.labelPosition === 'bottom') { %}
  {{ ctx.labelMarkup }}
{% } %}

{% if (ctx.component.description) { %}
  <div class="${applyPrefix('help-text')}">{{ctx.t(ctx.component.description)}}</div>
{% } %}
`;

export default TEMPLATE;
