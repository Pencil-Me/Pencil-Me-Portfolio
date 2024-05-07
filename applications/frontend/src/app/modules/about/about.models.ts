export interface ITech {
  label: string;
  percent: number;
  lastTouch?: string;
  project_count?: number;
}
export interface ITechCategory {
  title: string;
  data: ITech[];
}
