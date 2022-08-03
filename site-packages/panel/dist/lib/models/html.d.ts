import * as p from "@bokehjs/core/properties";
import { Markup } from "@bokehjs/models/widgets/markup";
import { ModelEvent, JSON } from "@bokehjs/core/bokeh_events";
import { PanelMarkupView } from "./layout";
export declare class DOMEvent extends ModelEvent {
    readonly node: string;
    readonly data: any;
    event_name: string;
    constructor(node: string, data: any);
    protected _to_json(): JSON;
}
export declare function htmlDecode(input: string): string | null;
export declare function runScripts(node: any): void;
export declare class HTMLView extends PanelMarkupView {
    model: HTML;
    _event_listeners: any;
    connect_signals(): void;
    render(): void;
    process_tex(): string;
    private contains_tex;
    private _remove_event_listeners;
    private _setup_event_listeners;
}
export declare namespace HTML {
    type Attrs = p.AttrsOf<Props>;
    type Props = Markup.Props & {
        events: p.Property<any>;
    };
}
export interface HTML extends HTML.Attrs {
}
export declare class HTML extends Markup {
    properties: HTML.Props;
    constructor(attrs?: Partial<HTML.Attrs>);
    static __module__: string;
    static init_HTML(): void;
}
