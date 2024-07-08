function getRequiredEnvironmentVariable(envVariableName: string): string {
  const value = process.env[envVariableName];
  if (!value) throw new Error(`Environment Variable ${envVariableName} not set.`);

  return value;
}

export function getBaseUrl(): string {
  return getRequiredEnvironmentVariable('BASE_URL');
}

export function isProductionMode(): boolean {
  return process.env.NODE_ENV === 'production';
}

export function isDevelopmentMode(): boolean {
  return process.env.NODE_ENV === 'development';
}

export function getPort(): number {
  return parseInt(process.env.PORT || '4000', 10);
}

export function getJWTSecret(): string {
  return getRequiredEnvironmentVariable('JWT_SECRET');
}

export function getCorsOrigins(): string[] {
  return JSON.parse(getRequiredEnvironmentVariable('CORS_ORIGINS')) as string[];
}

export function getMongoURI(): string {
  return getRequiredEnvironmentVariable('MONGO_URI');
}
