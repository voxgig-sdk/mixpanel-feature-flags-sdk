export interface Definition {
    context: string;
    experiment_id?: string;
    id: string;
    is_experiment_active?: boolean;
    key: string;
    name: string;
    project_id: number;
    ruleset: Record<string, any>;
    status: string;
    workspace_id: number;
}
export interface DefinitionListMatch {
    project_id?: string;
    token?: string;
}
export interface Flag {
    experiment_id?: string;
    is_experiment_active?: boolean;
    is_qa_tester?: boolean;
    variant_key: string;
    variant_value: any;
}
export interface FlagLoadMatch {
    context: string;
    project_id?: string;
    token?: string;
}
