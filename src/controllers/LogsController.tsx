import { useState, useEffect } from "react";
import { logger } from "../utils/logger";
import { ActivityLog } from "../models/ActivityLog";
import { LogsControllerProps } from "../models/props/LogsControllerProps";

export const useLogsController = ({ logs }: LogsControllerProps) => {

    const [displayLogs, setDisplayLogs] = useState<ActivityLog[]>([]);

    useEffect(() => {
        setDisplayLogs(logs);
        logger.log(`[Logs Controller] Logs updated: ${logs?.length || 0} entries`);
    }, [logs]);

    const handleTap = () => {
        logger.log('[Logs Controller] Button tapped!');
    }

    return {
        displayLogs,
        handleTap,
    };
}