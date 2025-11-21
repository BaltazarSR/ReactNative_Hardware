import { useState, useEffect } from "react";
import { logger } from "../utils/logger";

import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '../models/RootParamsListModel';

export const useActivityController = () => {

    const navigation = useNavigation<NavigationProp>();

    const handleGoToStats = () => {
        logger.log('[Stats Controller] Navigation to: Stats');
        navigation.navigate('Stats');
    }

    return {
        handleGoToStats,
    };
}