const config: I_Config = {
    version: "1.0.1",
    environment: "dev",
    name: "orchestration-graphic-generator",
    debug: false,
    graphicAnchorId: "svg_out",
    formAnchorId: "form",
    jsonImportId: "OG_inputfile",
    errorId: "OG_error",
    jsonDownloadName: "OG_export",
    svgDownloadName: "OG_export",
    diagramSettings: {
        paddingTopBottom: 30,
        paddingSide: 30,
        registerPadding: 25,
        tableHeight: 50,
        drawCircles: false,
    },
    colorPalettes: [
        ["#845ec2", "#d65db1", "#ff6f91", "#ff9671", "#ffc75f", "#f9f871", "#9bde7e", "#4bbc8e", "#039590", "#1c6e7d", "#2f4858"],
        ["#00ff16", "#00df77", "#00bb9e", "#0094a3", "#006d89", "#2f4858"],
    ],
};
