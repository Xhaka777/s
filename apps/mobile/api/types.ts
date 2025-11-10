export enum QueryKeys {
    //as a sample
    SIGNUP = 'signup',
    SIGNIN = 'signin',
}

export enum ApiRoutes {
    // SIGNUP = '/auth/signup',
    // SIGNIN = '/auth/signin'

    CHECK_SESSION = '/api/users/check-session',
    ONBOARDING_STAGE_ONE = '/api/users/onboardingStageOne',
    ONBOARDING_STAGE_TWO = '/api/users/onboardingStageTwo',
    ONBOARDING_STAGE_THREE = '/api/users/onboardingStageThree',
    REGISTER = '/api/users/register',
    VERIFF_WEBHOOK = '/api/users/veriff/webhook',
    VERIFF_STATUS = '/api/users/veriff/status',
}