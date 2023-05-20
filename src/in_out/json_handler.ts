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
            document.getElementById(config.errorId).innerHTML = `<div class="w3-panel w3-card-4 w3-red">
                <p>Imported JSON does not match Environment</p>
            </div>`;
            return;
        }
        if (version !== config.version) {
            if (!this.handleVersionMismatch(importedObj)) {
                document.getElementById(config.errorId).innerHTML = `<div class="w3-panel w3-card-4 w3-red">
                    <p>File was exported in version ${version} but your environment runs on ${config.version}. Migration is not possible.</p>
                </div>`;
                return;
            }
        }
        G_settings = (<{ name: string; version: string; content: I_Settings }>importedObj).content;
        form.draw();
        new DiagramGenerator();
    }

    /**
     * Handles Mismatches of environment version and file export version
     * @param importedObj Json content as object
     * @returns true if mismatched could be handled / false otherwise
     */
    private handleVersionMismatch(importedObj: Object): boolean {
        // After version 1.0.0 Mismatched versions will be handled here
        return false;
    }
}
