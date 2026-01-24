
import type { ClientConfig, ClientLicense } from './config';

export type GeneralState = {
  config: Partial<ClientConfig>;
  firstAdminVisitMarketplaceStatus: boolean;
  firstAdminCompleteSetup: boolean;
  license: ClientLicense;
  serverVersion: string;
};

export type SystemSetting = {
  name: string;
  value: string;
};
