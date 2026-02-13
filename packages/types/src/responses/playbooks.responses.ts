import type { Playbook, PlaybookRun } from "../playbooks";
import type { PaginatedListResponse } from "./common.responses";

export interface PlaybooksGetResponse extends Playbook {}
export interface PlaybooksCreateResponse extends Playbook {}
export interface PlaybooksUpdateResponse extends Playbook {}

export interface PlaybookRunsGetResponse extends PlaybookRun {}
export interface PlaybookRunsCreateResponse extends PlaybookRun {}
export interface PlaybookRunsUpdateResponse extends PlaybookRun {}

export interface PlaybooksListResponse
	extends PaginatedListResponse<Playbook> {}

export interface PlaybooksRunsListResponse
	extends PaginatedListResponse<PlaybookRun> {}
