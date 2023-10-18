type TUserId = number // tg id

type TUser = { // tg user
  id: TUserId
  username?: string // @username without @
  first_name: string
  last_name?: string
  profile_photo?: string // avatar url

  _name?: string // not used, only for mock, will be removed
}

type TTransaction = {
  id: string
  is_voice: boolean
  raw_text: string // shown if `formatted_text` does not exist
  formatted_text?: string // with <b>Name</b> highlighting
  currency_id: TCurrencyId
  is_confirmed: boolean // set true before patch
  shares: TShare[]
}

type TShare = {
  normalized_name?: string // may be missing if a new user is selected
  is_payer: boolean // paid or owed
  amount: number
  related_user_id?: TUserId
}

type TCurrencyId = string // 'RUB' | 'GEL' | 'TRY' | 'EUR'

type TCurrency = {
  id: TCurrencyId, // 'EUR'
  title: string, // 'Euro'
  symbol: string, // '€'
  in: string // 'In Euros'
  decimals: number // `4` usually
  visible_decimals: number // `2` usually
}

export type { TCurrencyId, TCurrency, TUser, TUserId, TShare, TTransaction }
