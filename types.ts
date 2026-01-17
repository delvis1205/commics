
export interface ImageHistoryItem {
  id: string;
  originalUrl: string;
  editedUrl: string;
  prompt: string;
  timestamp: number;
}

export enum EditMode {
  General = 'general',
  Portrait = 'portrait',
  Scenario = 'scenario',
  Commercial = 'commercial',
  Artistic = 'artistic'
}

export interface EditOptions {
  prompt: string;
  mode: EditMode;
}
