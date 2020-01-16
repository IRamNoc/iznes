export interface HighlightDetail {
    id: string;
}

export interface HighlightListState {
    highlightList: {
        [key: string]: HighlightDetail
    };
    applied: boolean;
}
