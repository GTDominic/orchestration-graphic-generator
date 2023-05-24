/**
 * Calculates the textcolor based on background color
 * @param bkg background color as HTML hex code (#ffffff)
 * @returns text color #000000 or #ffffff
 */
function OGG_getTextColor(bkg: string): string {
    let rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(bkg);
    let r = parseInt(rgb[1], 16);
    let g = parseInt(rgb[2], 16);
    let b = parseInt(rgb[3], 16);
    return r * 0.299 + g * 0.587 + b * 0.114 > 150 ? "#000000" : "#ffffff";
}
