type TUserId = number // tg id

type TUser = { // tg user
  _id: TUserId
  username?: string // @username without @
  first_name: string
  last_name?: string
  profile_photo: string | null // avatar url

  _name?: string // not used, only for mock, will be removed
}

type TTransaction = {
  _id: string
  chat_id: string | null
  is_voice: boolean
  raw_text: string // shown if `formatted_text` does not exist
  formatted_text?: string // with <b>Name</b> highlighting
  currency_id: TCurrencyId
  is_confirmed: boolean // set true before patch
  shares: TShare[]
}

type TShare = {
  person_id: string
  raw_name: string | null
  normalized_name: string | null // may be missing if a new user is selected
  is_payer: boolean // paid or owed
  amount: number
  user_candidates: /*[] |*/ null // todo
  related_user_id: TUserId | null
}

type TCurrencyId = string // 'RUB' | 'GEL' | 'TRY' | 'EUR'

type TCurrency = {
  _id: TCurrencyId, // 'EUR'
  title: string, // 'Euro'
  symbol: string, // '€'
  in: string // 'In Euros'
}

export type { TCurrencyId, TCurrency, TUser, TUserId, TShare, TTransaction }
