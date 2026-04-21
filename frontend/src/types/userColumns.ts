export type ColumnKey = "id" | "username" | "full_name" | "role" | "is_active";

export const columnConfig: { key: ColumnKey; label: string }[] = [
  { key: "id", label: "ID" },
  { key: "username", label: "Username" },
  { key: "full_name", label: "Full Name" },
  { key: "role", label: "Role" },
  { key: "is_active", label: "Active" },
];
