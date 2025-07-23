export interface BaseEntity {
  id: number;
  [key: string]: any;
}

export interface EntityState<T extends BaseEntity> {
  items: T[];
  count: number;
  loading: boolean;
  error: string | null;
  searchTerm: Record<string, any>;
  draftFilters: Record<string, any>;
  queuedUpdate: boolean;
}
