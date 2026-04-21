export interface User {
  id: number;
  username: string;
  full_name: string;
  role: string;
  is_active: boolean;
  profile_image?: string;
}
