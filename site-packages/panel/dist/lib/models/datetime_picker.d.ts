import flatpickr from "flatpickr";
import { InputWidget, InputWidgetView } from "@bokehjs/models/widgets/input_widget";
import { CalendarPosition } from "@bokehjs/core/enums";
import * as p from "@bokehjs/core/properties";
declare type DateStr = string;
declare type DatesList = (DateStr | [DateStr, DateStr])[];
export declare class DatetimePickerView extends InputWidgetView {
    model: DatetimePicker;
    private _picker;
    connect_signals(): void;
    remove(): void;
    styles(): string[];
    render(): void;
    protected _on_close(_selected_dates: Date[], date_string: string, _instance: flatpickr.Instance): void;
}
export declare namespace DatetimePicker {
    type Attrs = p.AttrsOf<Props>;
    type Props = InputWidget.Props & {
        value: p.Property<string>;
        min_date: p.Property<string | null>;
        max_date: p.Property<string | null>;
        disabled_dates: p.Property<DatesList>;
        enabled_dates: p.Property<DatesList>;
        position: p.Property<CalendarPosition>;
        inline: p.Property<boolean>;
        enable_time: p.Property<boolean>;
        enable_seconds: p.Property<boolean>;
        military_time: p.Property<boolean>;
        date_format: p.Property<string>;
        mode: p.Property<any>;
    };
}
export interface DatetimePicker extends DatetimePicker.Attrs {
}
export declare class DatetimePicker extends InputWidget {
    properties: DatetimePicker.Props;
    __view_type__: DatetimePickerView;
    constructor(attrs?: Partial<DatetimePicker.Attrs>);
    static __module__: string;
    static init_DatetimePicker(): void;
}
export {};
