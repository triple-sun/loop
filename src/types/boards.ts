export type BoardType = 'O' | 'P';

export type BoardCardPropertyType =
  | 'text'
  | 'number'
  | 'select'
  | 'multiSelect'
  | 'date'
  | 'person'
  | 'file'
  | 'checkbox'
  | 'url'
  | 'email'
  | 'phone'
  | 'createdTime'
  | 'createdBy'
  | 'updatedTime'
  | 'updatedBy'
  | 'unknown';

export interface BoardCardPropertyOption {
  id: string;
  value: string;
  color: string;
}

// A template for card properties attached to a board
export interface BoardCardPropertyTemplate {
  id: string;
  name: string;
  type: BoardCardPropertyType;
  options: BoardCardPropertyOption[];
}

export declare type Board = {
  id: string;
  teamId: string;
  channelId?: string;
  createdBy: string;
  modifiedBy: string;
  type: BoardType;
  minimumRole: string;

  title: string;
  description: string;
  icon?: string;
  showDescription: boolean;
  isTemplate: boolean;
  templateVersion: number;
  properties: Record<string, string | string[]>;
  cardProperties: BoardCardPropertyTemplate[];

  createAt: number;
  updateAt: number;
  deleteAt: number;
};

export declare type CreateBoardResponse = {
  boards: Board[];
};
