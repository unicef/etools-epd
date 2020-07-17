export interface Location {
  id: string;
  name: string;
  p_code: string;
  gateway: AdminLevel;
  parent?: string;
}

export interface AdminLevel {
  id: number;
  name: string;
  admin_level: string | null;
  created: string;
  modified: string;
}