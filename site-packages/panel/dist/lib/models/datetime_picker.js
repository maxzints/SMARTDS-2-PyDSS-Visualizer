import flatpickr from "flatpickr";
import { InputWidget, InputWidgetView } from "@bokehjs/models/widgets/input_widget";
import { input } from "@bokehjs/core/dom";
import { CalendarPosition } from "@bokehjs/core/enums";
import { isString } from "@bokehjs/core/util/types";
import * as inputs from "@bokehjs/styles/widgets/inputs.css";
import flatpickr_css from "@bokehjs/styles/widgets/flatpickr.css";
function _convert_date_list(value) {
    const result = [];
    for (const item of value) {
        if (isString(item))
            result.push(item);
        else {
            const [from, to] = item;
            result.push({ from, to });
        }
    }
    return result;
}
export class DatetimePickerView extends InputWidgetView {
    connect_signals() {
        super.connect_signals();
        const { value, min_date, max_date, disabled_dates, enabled_dates, position, inline, enable_time, enable_seconds, military_time, date_format, mode } = this.model.properties;
        this.connect(value.change, () => this._picker?.setDate(this.model.value));
        this.connect(min_date.change, () => this._picker?.set("minDate", this.model.min_date));
        this.connect(max_date.change, () => this._picker?.set("maxDate", this.model.max_date));
        this.connect(disabled_dates.change, () => this._picker?.set("disable", this.model.disabled_dates));
        this.connect(enabled_dates.change, () => this._picker?.set("enable", this.model.enabled_dates));
        this.connect(position.change, () => this._picker?.set("position", this.model.position));
        this.connect(inline.change, () => this._picker?.set("inline", this.model.inline));
        this.connect(enable_time.change, () => this._picker?.set("enableTime", this.model.enable_time));
        this.connect(enable_seconds.change, () => this._picker?.set("enableSeconds", this.model.enable_seconds));
        this.connect(military_time.change, () => this._picker?.set("time_24hr", this.model.military_time));
        this.connect(mode.change, () => this._picker?.set("mode", this.model.mode));
        this.connect(date_format.change, () => this._picker?.set("dateFormat", this.model.date_format));
    }
    remove() {
        this._picker?.destroy();
        super.remove();
    }
    styles() {
        return [...super.styles(), flatpickr_css];
    }
    render() {
        if (this._picker != null)
            return;
        super.render();
        this.input_el = input({ type: "text", class: inputs.input, disabled: this.model.disabled });
        this.group_el.appendChild(this.input_el);
        this._picker = flatpickr(this.input_el, {
            defaultDate: this.model.value,
            minDate: this.model.min_date ?? undefined,
            maxDate: this.model.max_date ?? undefined,
            inline: this.model.inline,
            position: this.model.position,
            disable: _convert_date_list(this.model.disabled_dates),
            enable: _convert_date_list(this.model.enabled_dates),
            enableTime: this.model.enable_time,
            enableSeconds: this.model.enable_seconds,
            time_24hr: this.model.military_time,
            dateFormat: this.model.date_format,
            mode: this.model.mode,
            onClose: (selected_dates, date_string, instance) => this._on_close(selected_dates, date_string, instance),
        });
    }
    _on_close(_selected_dates, date_string, _instance) {
        if (this.model.mode == "range" && !date_string.includes("to"))
            return;
        this.model.value = date_string;
        this.change_input();
    }
}
DatetimePickerView.__name__ = "DatetimePickerView";
export class DatetimePicker extends InputWidget {
    constructor(attrs) {
        super(attrs);
    }
    static init_DatetimePicker() {
        this.prototype.default_view = DatetimePickerView;
        this.define(({ Boolean, String, Array, Tuple, Or, Nullable }) => {
            const DateStr = String;
            const DatesList = Array(Or(DateStr, Tuple(DateStr, DateStr)));
            return {
                value: [String],
                min_date: [Nullable(String), null],
                max_date: [Nullable(String), null],
                disabled_dates: [DatesList, []],
                enabled_dates: [DatesList, []],
                position: [CalendarPosition, "auto"],
                inline: [Boolean, false],
                enable_time: [Boolean, true],
                enable_seconds: [Boolean, true],
                military_time: [Boolean, true],
                date_format: [String, "Y-m-d H:i:S"],
                mode: [String, "single"],
            };
        });
    }
}
DatetimePicker.__name__ = "DatetimePicker";
DatetimePicker.__module__ = "panel.models.datetime_picker";
DatetimePicker.init_DatetimePicker();
//# sourceMappingURL=datetime_picker.js.map