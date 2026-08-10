export interface ISaveAdminActivity {
  execute(dto: { adminId: string; ip: string }): Promise<void>;
}
