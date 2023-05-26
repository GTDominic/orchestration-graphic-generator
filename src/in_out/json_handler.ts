class JSONHandler {
    /**
     * Exports the graphic as json
     */
    public export(): void {
        let content = { name: config.name, version: config.version, content: G_settings };
        let a = document.createElement("a");
        let file = new Blob([JSON.stringify(content, null, 2)], { type: "text/plain" });
        a.href = URL.createObjectURL(file);
        a.download = `${config.jsonDownloadName}.json`;
        a.click();
    }

    /**
     * Imports the settings as json
     */
    public import(): void {
        document.getElementById(config.errorId).innerHTML = "";
        let file = (<HTMLInputElement>document.getElementById(config.jsonImportId)).files[0];
        if (!file) return;
        let reader = new FileReader();
        reader.onload = (evt) => this.parseData(String(evt.target.result));
        reader.readAsText(file);
    }

    /**
     * Parses the data and checks if json file is correct
     * @param content json file content as string
     */
    private parseData(content: string): void {
        let importedObj: Object = JSON.parse(content);
        let version: string;
        let name: string;
        version = (<{ name: string; version: string; content: I_Settings }>importedObj).version;
        name = (<{ name: string; version: string; content: I_Settings }>importedObj).name;
        if (!version || name !== config.name) {
            document.getElementById(config.errorId).innerHTML = `<div class="w3-container w3-red">
                <p>Imported JSON does not match Environment</p>
            </div>`;
            return;
        }
        let importO: { name: string; version: string; content: I_Settings } = <
            { name: string; version: string; content: I_Settings }
        >importedObj;
        if (version !== config.version) {
            if (!this.handleVersionMismatch(importO)) {
                document.getElementById(
                    config.errorId
                ).innerHTML = `<div class="w3-container w3-red">
                    <p>File was exported in version ${version} but your environment runs on ${config.version}. Migration is not possible.</p>
                </div>`;
                return;
            }
        }
        G_settings = importO.content;
        form.draw();
        new DiagramGenerator();
    }

    /**
     * Handles Mismatches of environment version and file export version
     * @param importedObj Json content as object
     * @returns true if mismatched could be handled / false otherwise
     */
    private handleVersionMismatch(importedObj: {
        name: string;
        version: string;
        content: I_Settings;
    }): boolean {
        let iv = importedObj.version.split(".");
        let ev = config.version.split(".");
        let ivx = Number(iv[0]);
        let ivy = Number(iv[1]);
        let evx = Number(ev[0]);
        let evy = Number(ev[1]);
        // Never allow different Mayor versions X.y.z
        if (ivx !== evx) return false;
        // Always allow different Patch version x.y.Z
        if (ivy === evy) return true;
        // Update old json files
        // Bump version 1.0.z to 1.1.z
        if (ivy === 0) ivy++;
        // Bump version 1.1.z to 1.2.z
        if (ivy === 1) {
            importedObj.content.conductorEnabled = true;
            for (let row of importedObj.content.rows) {
                for (let reg of row.registers) {
                    reg.linked = "-1:-1";
                    reg.showMove = false;
                }
            }
            ivy++;
        }
        // Check version match
        if (ivy === evy) return true;
        return false;
    }
}
