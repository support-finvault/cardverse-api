export class RequestUserDto {
  user_id: number;
  app_user_id: number;
  company_id: number;
  role_id: number;
  user_type_code: string;
  role_code: string;
  is_super_admin: boolean;
  apply_company_filter: boolean;
  user_ref: string;
  company_ref: string;
  is_external_user: boolean;
}
