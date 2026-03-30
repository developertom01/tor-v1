export interface FeatureFlags {
  online_payment: boolean
}

const DEFAULT_FLAGS: FeatureFlags = {
  online_payment: false,
}

export async function getFeatureFlags(): Promise<FeatureFlags> {
  const token = process.env.DOPPLER_TOKEN
  if (!token) return DEFAULT_FLAGS

  try {
    const res = await fetch(
      'https://api.doppler.com/v3/configs/config/secrets/download?format=json&include_dynamic_secrets=false',
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`${token}:`).toString('base64')}`,
        },
        next: { revalidate: 60 },
      } as RequestInit & { next: { revalidate: number } }
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
