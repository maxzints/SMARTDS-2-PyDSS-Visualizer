import { HTMLBox } from "@bokehjs/models/layouts/html_box";
import { ModelEvent, JSON } from "@bokehjs/core/bokeh_events";
import * as p from "@bokehjs/core/properties";
import { ColumnDataSource } from "@bokehjs/models/sources/column_data_source";
import { TableColumn } from "@bokehjs/models/widgets/tables";
import { PanelHTMLBoxView } from "./layout";
export declare class TableEditEvent extends ModelEvent {
    readonly column: string;
    readonly row: number;
    event_name: string;
    constructor(column: string, row: number);
    protected _to_json(): JSON;
}
export declare class CellClickEvent extends ModelEvent {
    readonly column: string;
    readonly row: number;
    event_name: string;
    constructor(column: string, row: number);
    protected _to_json(): JSON;
}
export declare class DataTabulatorView extends PanelHTMLBoxView {
    model: DataTabulator;
    tabulator: any;
    _tabulator_cell_updating: boolean;
    _updating_page: boolean;
    _updating_sort: boolean;
    _relayouting: boolean;
    _selection_updating: boolean;
    _initializing: boolean;
    _lastVerticalScrollbarTopPosition: number;
    _timeout_queue: any[];
    connect_signals(): void;
    get sorters(): any[];
    renderComplete(): void;
    redraw(): void;
    after_layout(): void;
    render(): void;
    tableInit(view: DataTabulatorView, tabulator: any): void;
    relayout(): void;
    requestPage(page: number, sorters: any[]): Promise<void>;
    getLayout(): string;
    getConfiguration(): any;
    renderChildren(initializing?: boolean): void;
    _render_row(row: any): void;
    _expand_render(cell: any): string;
    _update_expand(cell: any): void;
    getData(): any[];
    getColumns(): any;
    renderEditor(column: any, cell: any, onRendered: any, success: any, error: any): any;
    setData(): void;
    addData(): void;
    postUpdate(): void;
    updateOrAddData(): void;
    setFrozen(): void;
    setGroupBy(): void;
    setSorters(): void;
    setCSS(): boolean;
    setStyles(): void;
    setHidden(): void;
    setMaxPage(): void;
    setPage(): void;
    setPageSize(): void;
    setSelection(): void;
    rowClicked(e: any, row: any): void;
    _filter_selected(indices: number[]): number[];
    rowSelectionChanged(data: any, _: any): void;
    cellEdited(cell: any): void;
}
export declare const TableLayout: import("@bokehjs/core/kinds").Kinds.Enum<"fit_data" | "fit_data_fill" | "fit_data_stretch" | "fit_data_table" | "fit_columns">;
export declare namespace DataTabulator {
    type Attrs = p.AttrsOf<Props>;
    type Props = HTMLBox.Props & {
        aggregators: p.Property<any>;
        buttons: p.Property<any>;
        children: p.Property<any>;
        columns: p.Property<TableColumn[]>;
        configuration: p.Property<any>;
        download: p.Property<boolean>;
        editable: p.Property<boolean>;
        expanded: p.Property<number[]>;
        filename: p.Property<string>;
        filters: p.Property<any[]>;
        follow: p.Property<boolean>;
        frozen_rows: p.Property<number[]>;
        groupby: p.Property<string[]>;
        hidden_columns: p.Property<string[]>;
        indexes: p.Property<string[]>;
        layout: p.Property<typeof TableLayout["__type__"]>;
        max_page: p.Property<number>;
        page: p.Property<number>;
        page_size: p.Property<number>;
        pagination: p.Property<string | null>;
        select_mode: p.Property<any>;
        selectable_rows: p.Property<number[] | null>;
        source: p.Property<ColumnDataSource>;
        sorters: p.Property<any[]>;
        styles: p.Property<any>;
        theme: p.Property<string>;
        theme_url: p.Property<string>;
    };
}
export interface DataTabulator extends DataTabulator.Attrs {
}
export declare class DataTabulator extends HTMLBox {
    properties: DataTabulator.Props;
    constructor(attrs?: Partial<DataTabulator.Attrs>);
    static __module__: string;
    static init_DataTabulator(): void;
}
