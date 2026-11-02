export interface WsAllowedIp {
    id: number;
    customer: string;
    ip: string;
    user: string;
    pass: string;
    softwareName: string;
    active: boolean;
    statusLabel: string;
    blockStatus: string;
}

export interface NamedOption {
    id: string;
    title: string;
}

export interface CheckUserPayload {
    id: number;
    user: string;
    pass: string;
    search_flight_departure: string;
    search_flight_arrival: string;
    date: string;
}

export interface WsAllowedIpFilters {
    keyword: string;
}
