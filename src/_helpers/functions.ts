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

/**
 * Calculates the player and border angles
 * @param row Row to calculate
 * @returns player and border angles
 */
function OGG_getBorderPlayerAngles(row: I_RowSettings): {
    player: Array<number>;
    border: Array<number>;
} {
    let players = OGG_getRowPlayers(row);
    if (players === 0) return null;
    let playerAngles: Array<number> = [];
    let borderAngles: Array<number> = [];
    let a = (row.leftAngleBorder ? 0.5 : 0) + (row.rightAngleBorder ? 0.5 : 0);
    let distance = (row.leftAngle + row.rightAngle) / (players - a);
    let tempAngle = (row.leftAngleBorder ? 0 : distance / 2) - row.leftAngle;
    for (let i = 0; i < players; i++) {
        playerAngles.push(tempAngle);
        tempAngle += distance;
    }
    if (config.environment === "dev" && config.debug) console.log(playerAngles);
    tempAngle = -row.leftAngle - (row.leftAngleBorder ? distance / 2 : 0);
    borderAngles.push(tempAngle);
    for (let reg of row.registers) {
        tempAngle += distance * reg.count;
        borderAngles.push(tempAngle);
    }
    if (config.environment === "dev" && config.debug) console.log(borderAngles);
    return { player: playerAngles, border: borderAngles };
}

/**
 * Counts the players in a row
 * @param row row to count
 * @returns count of players
 */
function OGG_getRowPlayers(row: I_RowSettings): number {
    let players = 0;
    for (let reg of row.registers) players += reg.count;
    return players;
}
