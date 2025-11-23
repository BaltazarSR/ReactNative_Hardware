import { useState, useEffect } from "react";
import { logger } from "../utils/logger";
import { RouteService } from "../services/RouteService";
import { StorageService } from "../services";
import { SessionStatsModel } from "../models/SessionStatsModel";
import { MapControllerProps } from "../models/props/MapControllerProps";

export const useMapController = ({ sessionId }: MapControllerProps) => {

    const [selectedRoute, setSelectedRoute] = useState<SessionStatsModel>();
    const [loading, setLoading] = useState(true);
    const [routeService] = useState(() => new RouteService());
    const [storageService] = useState(() => new StorageService());

    useEffect(() => {
       const loadSession = async () => {
           const session = await storageService.getSessionById(sessionId);
           setSelectedRoute(session || undefined);
           setLoading(false);
       };
       loadSession();
    }, [sessionId]);

    const getMapRegion = () => {
        if (!selectedRoute || selectedRoute.route.length === 0) {
            return {
                latitude: 0,
                longitude: 0,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            };
        }
        return routeService.calculateMapRegion(selectedRoute.route);
    };

    const getStartPoint = () => {
        if (!selectedRoute || selectedRoute.route.length === 0) {
            return null;
        }
        return selectedRoute.route[0];
    };

    const getEndPoint = () => {
        if (!selectedRoute || selectedRoute.route.length === 0) {
            return null;
        }
        return selectedRoute.route[selectedRoute.route.length - 1];
    };

    const formatDistance = () => {
        if (!selectedRoute) {
            return '0 m';
        }
        return routeService.formatDistance(selectedRoute.distance);
    };

    const formatDuration = () => {
        if (!selectedRoute) {
            return '0:00 s';
        }
        return routeService.formatDuration(selectedRoute.duration);
    };

    const formatCalories = () => {
        if (!selectedRoute) {
            return '0 cal';
        }
        return routeService.formatCalories(selectedRoute.calories);
    };

    const formatPoints = () => {
        if (!selectedRoute) {
            return '0 points';
        }
        return routeService.formatSteps(selectedRoute.logs.length);
    };

    return {
        selectedRoute,
        loading,
        getMapRegion,
        getStartPoint,
        getEndPoint,
        formatDistance,
        formatDuration,
        formatCalories,
        formatPoints,
    };
}