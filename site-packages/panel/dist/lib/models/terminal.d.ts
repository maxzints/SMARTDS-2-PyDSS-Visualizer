import { HTMLBox } from "@bokehjs/models/layouts/html_box";
import * as p from "@bokehjs/core/properties";
import { ModelEvent, JSON } from "@bokehjs/core/bokeh_events";
import { PanelHTMLBoxView } from "./layout";
export declare class KeystrokeEvent extends ModelEvent {
    readonly key: string;
    event_name: string;
    constructor(key: string);
    protected _to_json(): JSON;
}
export declare class TerminalView extends PanelHTMLBoxView {
    model: Terminal;
    term: any;
    webLinksAddon: any;
    container: HTMLDivElement;
    _rendered: boolean;
    connect_signals(): void;
    render(): void;
    getNewTerminal(): any;
    getNewWebLinksAddon(): any;
    handleOnData(value: string): void;
    write(): void;
    clear(): void;
    fit(): void;
    after_layout(): void;
    resize_layout(): void;
}
export declare namespace Terminal {
    type Attrs = p.AttrsOf<Props>;
    type Props = HTMLBox.Props & {
        options: p.Property<any>;
        output: p.Property<string>;
        ncols: p.Property<number>;
        nrows: p.Property<number>;
        _clears: p.Property<number>;
    };
}
export interface Terminal extends Terminal.Attrs {
}
export declare class Terminal extends HTMLBox {
    properties: Terminal.Props;
    constructor(attrs?: Partial<Terminal.Attrs>);
    static __module__: string;
    static init_Terminal(): void;
}
