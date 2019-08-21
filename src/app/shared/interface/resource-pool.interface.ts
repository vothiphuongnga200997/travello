export interface MetricDataInterface {
    id: string;
    name: string;
    platform: {
        name: string;
        version: string;
    };
    cpu: {
        cores: number;
        pct: number;
    };
    ram: {
        used: number;
        free: number;
        total: number;
        pct: number;
    };
    disk: {
        total: number;
        available: number;
        used: number;
        pct: number;
    };
    status: string;
    workflowId?: string;
    workflow?: {
        name?: string;
        structure?: Array<{
            name?: string;
            status: string;
        }>;
    };
    time?: string;
}
