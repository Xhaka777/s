import { useQuery } from "@tanstack/react-query";
import { onboardingService } from "../services/onboarding";
import { tokenStorage } from "../services/tokenStorage";

export const useOnboardingStatus = () => {
    return useQuery({
        queryKey: ['onboarding-status'],
        queryFn: async () => {
            const token = await tokenStorage.getToken();
            if (!token) {
                throw new Error('No session token');
            }
            return onboardingService.checkSession(token);
        },
        enabled: true,
        refetchOnMount: true,
        staleTime: 0,
    })
}