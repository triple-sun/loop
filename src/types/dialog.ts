export type Dialog = {
  callback_id?: string;
  elements?: DialogElement[];
  title: string;
  introduction_text?: string;
  icon_url?: string;
  submit_label?: string;
  notify_on_cancel?: boolean;
  state?: string;
};

export type DialogSubmission = {
  url?: string;
  callback_id: string;
  state: string;
  user_id: string;
  channel_id: string;
  team_id: string;
  submission: {
    [x: string]: string;
  };
  cancelled: boolean;
};

export type DialogElement = {
  display_name: string;
  name: string;
  type: string;
  subtype?: string;
  default?: string;
  placeholder?: string;
  help_text?: string;
  optional?: boolean;
  min_length?: number;
  max_length?: number;
  data_source?: string;
  options?: Array<{
    text: string;
    value: any;
  }>;
};

export type SubmitDialogResponse = {
  error?: string;
  errors?: Record<string, string>;
};

export type OpenDialogParams = {
  trigger_id: string;
  url?: string;
  dialog: Dialog;
};
