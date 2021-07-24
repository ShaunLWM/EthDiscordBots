import fs from "fs-extra";

export class ConfigManager {
	private _config: Record<string, any>;
	private _path: string;
	private _autosave: boolean;

	constructor(file = "", autosave = true) {
		this._autosave = autosave;
		if (!file) {
			this._config = {};
			this._path = "config.json";
		} else {
			this._path = file;
			if (!fs.existsSync(file)) {
				this._config = {};
			} else {
				this._config = fs.readJsonSync(file);
			}
		}
	}

	get config(): Record<string, any> {
		return this._config;
	}

	get<T>(key: keyof T): T[keyof T] {
		return (this._config as T)[key] as T[keyof T];
	}

	set<T>(key: keyof T, value: T[keyof T]): void {
		(this._config as T)[key] = value;
		if (this._autosave) {
			this.save();
		}
	}

	save(): void {
		fs.writeJSONSync(this._path, this._config);
	}
}
