import type { TableType } from "../types/orders.types";

export interface AnalysisTableProps {
  type: TableType;
  limit?: number;
  title?: string;
  showFilters?: boolean;
  showPagination?: boolean;
  onRowClick?: (row: any) => void;
  onSelectionChange?: (selectedIds: (string | number)[]) => void;
}