import { ILoopDialog, LoopActionType } from "fox-loop-sdk";
import { Dialog } from "./dialog";
import { AppContextProps } from "./apps";

export interface Context{
    app_id?: string;
    location?: string;
    acting_user_id?: string;
    user_id?: string;
    channel_id?: string;
    team_id?: string;
    post_id?: string;
    root_id?: string;
    props?: AppContextProps;
    user_agent?: string;
    track_as_submit?: boolean;
    acting_user?: {id: string};
    type?: LoopActionType;
    service?: string;
    token?: string;
    general?: number;
    nav?: {
        history?: string[];
        goBack?: boolean;
    };
    confirm?: {
        dialog: Dialog;
        path: string;
    };
    [key: string]: unknown;
}
