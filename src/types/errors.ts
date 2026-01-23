export type ServerError = {
  type?: string;
  serverErrorId?: string;
  stack?: string;
  message: string;
  status?: number | undefined;
  url?: string;
};
