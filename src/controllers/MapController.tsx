import { useState, useEffect } from "react";
import { logger } from "../utils/logger";

export const useMapController = () => {

    const handleTap = () => {
        logger.log('[Map Controller] Button tapped!');
    }

    return {
        handleTap,
    };
}