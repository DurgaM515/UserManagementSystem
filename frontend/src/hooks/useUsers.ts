import { useEffect, useMemo, useState } from "react";
import { getUsers } from "../api";
import { User } from "../types";

type UseUsersParams = {
  refresh: boolean;
  searchTerm: string;
};

export default function useUsers({ refresh, searchTerm }: UseUsersParams) {
  const [users, setUsers] = useState<User[]>([]);

  const loadUsers = async () => {
    const res = await getUsers();
    setUsers(res.data);
  };

  useEffect(() => {
    loadUsers();
  }, [refresh]);

  const filteredUsers = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    if (!search) return users;

    return users.filter((u) => {
      return (
        u.username.toLowerCase().includes(search) ||
        u.full_name.toLowerCase().includes(search)
      );
    });
  }, [users, searchTerm]);

  return {
    users,
    setUsers,
    filteredUsers,
    loadUsers,
  };
}
