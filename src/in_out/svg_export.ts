class SVGExport {
    /**
     * Downloads the svg as graphic
     */
    public download() {
        let svg = document.getElementById(config.graphicAnchorId).innerHTML;
        let a = document.createElement("a");
        let preface = '<?xml version="1.0" standalone="no"?>\r\n';
        let file = new Blob([preface, svg], { type: "image/svg+xml;charset=utf-8" });
        a.href = URL.createObjectURL(file);
        a.download = `${config.svgDownloadName}.svg`;
        a.click();
    }
}
