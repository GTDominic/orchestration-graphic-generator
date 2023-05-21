const config: I_Config = {
    version: "0.5.0",
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
        drawCircles: false,
        colors: ["#060010", "#2c1ce6", "#5d0f20", "#f3ddd6", "#adcdc7", "#12d1f5", "#ee1a87", "#dd450b", "#7546fa"],
    },
};
