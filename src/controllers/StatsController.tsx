import { useState, useEffect } from "react";
import { logger } from "../utils/logger";

import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '../models/RootParamsListModel';

export const useStatsController = () => {

    const navigation = useNavigation<NavigationProp>();

    const handleMapSelected = () => {
        logger.log('[Stats Controller] Navigation to: Map');
        navigation.navigate('Map');
    }

    return {
        handleMapSelected,
    };
}