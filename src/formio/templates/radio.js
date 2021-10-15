import { applyPrefix } from '../utils';

const TEMPLATE = `
<div class="${applyPrefix('form-choices')}">
  {% ctx.values.forEach(function(item) { %}
    <div class="${applyPrefix('form-choices__choice')}">
        <div class="utrecht-form-field utrecht-form-field--checkbox utrecht-form-field--distanced">
              <{{ctx.input.type}}
                ref="input"

                {% for (var attr in ctx.input.attr) { %}
                  {{attr}}="{{ctx.input.attr[attr]}}"
                {% } %}

                value="{{item.value}}"

                {% if (ctx.value && (ctx.value === item.value || (typeof ctx.value === 'object' && ctx.value.hasOwnProperty(item.value) && ctx.value[item.value]))) { %}
                  checked=true
                {% } %}

                {% if (item.disabled) { %}
                  disabled=true
                {% } %}

                id="{{ctx.id}}{{ctx.row}}-{{item.value}}"

                class="utrecht-form-field__input utrecht-checkbox"
              >
                {{ctx.input.content}}
            </{{ctx.input.type}}>

<!--            <div class="${applyPrefix('checkbox__checkmark')}"></div>-->

            {% if (!ctx.component.optionsLabelPosition || ctx.component.optionsLabelPosition === 'right' || ctx.component.optionsLabelPosition === 'bottom') { %}
                <label class="utrecht-form-field__label utrecht-form-field__label--checkbox utrecht-form-label utrecht-form-label--checkbox" for="{{ctx.id}}{{ctx.row}}-{{item.value}}">{{ctx.t(item.label)}}</label>
            {% } %}
        </div>
    </div>
      {% }) %}
</div>
`;

export default TEMPLATE;
