export interface LinkConfig {
    link: string;
    anchorCss: string;
    anchorText: string;
}

export interface MessageWithLinksConfig {
   data: {
      links: LinkConfig[];
   };
}
