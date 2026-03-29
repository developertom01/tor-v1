/**
 * Feature flags fetched at runtime from a dedicated Doppler project.
 * Flags update without redeployment — just change values in Doppler.
 *
 * Setup:
 *  1. Create a Doppler project called `feature-flags` with `dev` and `prod` configs.
 *  2. Add a service token for each config and set DOPPLER_FEATURE_FLAGS_TOKEN in each store's env.
 *
 * Flag values are strings ("true" / "false") in Doppler.
 */

export interface FeatureFlags {
  online_payment: boolean
}

const DEFAULT_FLAGS: FeatureFlags = {
  online_payment: false,
}

export async function getFeatureFlags(): Promise<FeatureFlags> {
  const token = process.env.DOPPLER_FEATURE_FLAGS_TOKEN
  if (!token) return DEFAULT_FLAGS

  try {
    const res = await fetch(
      'https://api.doppler.com/v3/configs/config/secrets/download?format=json&include_dynamic_secrets=false',
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`${token}:`).toString('base64')}`,
        },
        // Cache for 60 seconds — flags update within a minute of changing in Doppler
        next: { revalidate: 60 },
      }
    )

    if (!res.ok) return DEFAULT_FLAGS

    const data = await res.json()

    return {
      online_payment: data.ONLINE_PAYMENT === 'true',
    }
  } catch {
    return DEFAULT_FLAGS
  }
}
