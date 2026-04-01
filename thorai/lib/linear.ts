const LINEAR_API_URL = 'https://api.linear.app/graphql'

type LinearIssueResult = {
  id: string
  identifier: string
  url: string
}

async function linearRequest<T>(query: string, variables: Record<string, unknown>): Promise<T> {
  const apiKey = process.env.LINEAR_API_KEY
  if (!apiKey) throw new Error('LINEAR_API_KEY is not set')

  const res = await fetch(LINEAR_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: apiKey,
    },
    body: JSON.stringify({ query, variables }),
  })

  if (!res.ok) throw new Error(`Linear API error: ${res.status} ${res.statusText}`)

  const json = await res.json()
  if (json.errors?.length) throw new Error(json.errors[0].message)

  return json.data as T
}

export type NewStoreRegistrationInput = {
  ownerName: string
  businessName: string
  category: string
  locationCountry: string
  locationCity?: string
  whatsapp?: string
  colorPalette?: string
  paymentMethods: string[]
  userEmail: string
}

export async function createStoreRegistrationTicket(
  input: NewStoreRegistrationInput
): Promise<LinearIssueResult> {
  const teamId = process.env.LINEAR_WEBSITE_BUILDER_TEAM_ID
  if (!teamId) throw new Error('LINEAR_WEBSITE_BUILDER_TEAM_ID is not set')

  const description = `
## New Store Registration

| Field | Value |
|-------|-------|
| **Owner** | ${input.ownerName} |
| **Business** | ${input.businessName} |
| **Category** | ${input.category} |
| **Location** | ${input.locationCity ? `${input.locationCity}, ` : ''}${input.locationCountry} |
| **WhatsApp** | ${input.whatsapp || '—'} |
| **Color Palette** | ${input.colorPalette || '—'} |
| **Payment Methods** | ${input.paymentMethods.join(', ') || '—'} |
| **Submitted by** | ${input.userEmail} |

> This ticket was automatically created by ThorAI when the vendor completed their store registration.
`.trim()

  const mutation = `
    mutation CreateIssue($input: IssueCreateInput!) {
      issueCreate(input: $input) {
        success
        issue {
          id
          identifier
          url
        }
      }
    }
  `

  const data = await linearRequest<{
    issueCreate: { success: boolean; issue: LinearIssueResult }
  }>(mutation, {
    input: {
      teamId,
      title: `New Store: ${input.businessName} (${input.ownerName})`,
      description,
    },
  })

  if (!data.issueCreate.success) throw new Error('Linear issue creation failed')
  return data.issueCreate.issue
}
