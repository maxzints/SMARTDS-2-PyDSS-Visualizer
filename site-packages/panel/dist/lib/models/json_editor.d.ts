import * as p from "@bokehjs/core/properties";
import { ModelEvent, JSON } from "@bokehjs/core/bokeh_events";
import { HTMLBox } from "@bokehjs/models/layouts/html_box";
import { PanelHTMLBoxView } from "./layout";
export declare class JSONEditEvent extends ModelEvent {
    readonly data: any;
    event_name: string;
    constructor(data: any);
    protected _to_json(): JSON;
}
export declare class JSONEditorView extends PanelHTMLBoxView {
    model: JSONEditor;
    editor: any;
    _menu_context: any;
    connect_signals(): void;
    remove(): void;
    render(): void;
}
export declare namespace JSONEditor {
    type Attrs = p.AttrsOf<Props>;
    type Props = HTMLBox.Props & {
        data: p.Property<any>;
        menu: p.Property<boolean>;
        mode: p.Property<string>;
        search: p.Property<boolean>;
        selection: p.Property<any[]>;
        schema: p.Property<any>;
        templates: p.Property<any[]>;
    };
}
export interface JSONEditor extends JSONEditor.Attrs {
}
export declare class JSONEditor extends HTMLBox {
    properties: JSONEditor.Props;
    constructor(attrs?: Partial<JSONEditor.Attrs>);
    static __module__: string;
    static init_JSONEditor(): void;
}
