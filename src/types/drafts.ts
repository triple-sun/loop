
import type { PostMetadata, PostPriorityMetadata } from './posts';

export type Draft = {
  create_at: number;
  update_at: number;
  delete_at: number;
  user_id: string;
  channel_id: string;
  root_id: string;
  message: string;
  props: Record<string, any>;
  file_ids?: string[];
  metadata?: PostMetadata;
  priority?: PostPriorityMetadata;
};
