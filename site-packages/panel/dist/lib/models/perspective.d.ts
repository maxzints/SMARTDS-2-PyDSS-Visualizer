import { HTMLBox } from "@bokehjs/models/layouts/html_box";
import * as p from "@bokehjs/core/properties";
import { ColumnDataSource } from "@bokehjs/models/sources/column_data_source";
import { PanelHTMLBoxView } from "./layout";
export declare class PerspectiveView extends PanelHTMLBoxView {
    model: Perspective;
    perspective_element: any;
    table: any;
    worker: any;
    _updating: boolean;
    _config_listener: any;
    _current_config: any;
    _event_listener: any;
    _loaded: boolean;
    connect_signals(): void;
    disconnect_signals(): void;
    render(): Promise<void>;
    fix_layout(): void;
    sync_config(): boolean;
    on_event(event: any): void;
    get data(): any;
    stream(data: any, rollover: any): void;
    patch(_: any): void;
    setData(): void;
}
export declare namespace Perspective {
    type Attrs = p.AttrsOf<Props>;
    type Props = HTMLBox.Props & {
        aggregates: p.Property<any>;
        split_by: p.Property<any[] | null>;
        columns: p.Property<any[]>;
        expressions: p.Property<any[] | null>;
        editable: p.Property<boolean | null>;
        filters: p.Property<any[] | null>;
        group_by: p.Property<any[] | null>;
        plugin: p.Property<any>;
        plugin_config: p.Property<any>;
        selectable: p.Property<boolean | null>;
        toggle_config: p.Property<boolean>;
        schema: p.Property<any>;
        sort: p.Property<any[] | null>;
        source: p.Property<ColumnDataSource>;
        theme: p.Property<any>;
    };
}
export interface Perspective extends Perspective.Attrs {
}
export declare class Perspective extends HTMLBox {
    properties: Perspective.Props;
    constructor(attrs?: Partial<Perspective.Attrs>);
    static __module__: string;
    static init_Perspective(): void;
}
