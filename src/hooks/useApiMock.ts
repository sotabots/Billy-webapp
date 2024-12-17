import { TShare, TTransaction, TUser, TChat, TSummary, TRates, TLanguageCode, TPayoffMethod, TPayoffMethods, TUserPayoffMethod } from '../types'


import { decimals } from '../const'

import i18n from '../i18n'

import avatar0 from '../assets/avatar-0.jpg'
import avatar1 from '../assets/avatar-1.jpg'
import avatar2 from '../assets/avatar-2.jpg'
import avatar3 from '../assets/avatar-3.jpg'
import avatar4 from '../assets/avatar-4.jpg'

import { TCurrency } from '../types'

const mockCurrencies: TCurrency[] = [
  {
      _id: "USD",
      title: {
          en: "Dollar",
          ru: "Доллар",
          uk: "Доллар"
      },
      symbol: "$",
      flag: "🇺🇸",
      is_crypto: false,
      is_fiat: true,
  },
  {
      _id: "VND",
      title: {
          en: "Dong",
          ru: "Донг",
          uk: "Донг"
      },
      symbol: "đ",
      flag: "🇻🇳",
      is_crypto: false,
      is_fiat: true,
  },
  {
      _id: "EUR",
      title: {
          en: "Euro",
          ru: "Евро",
          uk: "Евро"
      },
      symbol: "€",
      flag: "🇪🇺",
      is_crypto: false,
      is_fiat: true,
  },
  {
      _id: "RUB",
      title: {
          en: "Rubles",
          ru: "Рубли",
          uk: "Рубли"
      },
      symbol: "₽",
      flag: "🇷🇺",
      is_crypto: false,
      is_fiat: true,
  },
  {
      _id: "GEL",
      title: {
          en: "Lari",
          ru: "Лари",
          uk: "Ларi"
      },
      symbol: "₾",
      flag: "🇬🇪",
      is_crypto: false,
      is_fiat: true,
  },
  {
      _id: "TRY",
      title: {
          en: "Lira",
          ru: "Лира",
          uk: "Лiра"
      },
      symbol: "₺",
      flag: "🇹🇷",
      is_crypto: false,
      is_fiat: true,
  },
  {
      _id: "GBP",
      title: {
          en: "Pound",
          ru: "Фунт",
          uk: "Фунт"
      },
      symbol: "£",
      flag: "🇬🇧",
      is_crypto: false,
      is_fiat: true,
  },
  {
      _id: "UAH",
      title: {
          en: "Hryvna",
          ru: "Гривна",
          uk: "Грiвна"
      },
      symbol: "₴",
      flag: "🇺🇦",
      is_crypto: false,
      is_fiat: true,
  },
  {
      _id: "KZT",
      title: {
          en: "Tenge",
          ru: "Тенге",
          uk: "Тенге"
      },
      symbol: "₸",
      flag: "🇰🇿",
      is_crypto: false,
      is_fiat: true,
  },
  {
      _id: "BYN",
      title: {
          en: "Ruble",
          ru: "Рубль",
          uk: "Рубль"
      },
      symbol: "Br",
      flag: "🇧🇾",
      is_crypto: false,
      is_fiat: true,
  },
  {
      _id: "AZN",
      title: {
          en: "Manat",
          ru: "Манат",
          uk: "Манат"
      },
      symbol: "₼",
      flag: "🇦🇿",
      is_crypto: false,
      is_fiat: true,
  },
  {
      _id: "AMD",
      title: {
          en: "Dram",
          ru: "Драм",
          uk: "Драм"
      },
      symbol: "֏",
      flag: "🇦🇲",
      is_crypto: false,
      is_fiat: true,
  },
  {
      _id: "MDL",
      title: {
          en: "Leu",
          ru: "Лев",
          uk: "Лев"
      },
      symbol: "L",
      flag: "🇲🇩",
      is_crypto: false,
      is_fiat: true,
  },
  {
      _id: "KGS",
      title: {
          en: "Som",
          ru: "Сом",
          uk: "Сом"
      },
      symbol: "с",
      flag: "🇰🇬",
      is_crypto: false,
      is_fiat: true,
  },
  {
      _id: "TJS",
      title: {
          en: "Somoni",
          ru: "Сомони",
          uk: "Сомони"
      },
      symbol: "ЅМ",
      flag: "🇹🇯",
      is_crypto: false,
      is_fiat: true,
  },
  {
      _id: "UZS",
      title: {
          en: "Som",
          ru: "Сом",
          uk: "Сом"
      },
      symbol: "сўм",
      flag: "🇺🇿",
      is_crypto: false,
      is_fiat: true,
  },
  {
      _id: "KRW",
      title: {
          en: "Won",
          ru: "Вон",
          uk: "Вон"
      },
      symbol: "₩",
      flag: "🇰🇷",
      is_crypto: false,
      is_fiat: true,
  },
  {
      _id: "JPY",
      title: {
          en: "Yen",
          ru: "Иена",
          uk: "Иена"
      },
      symbol: "¥",
      flag: "🇯🇵",
      is_crypto: false,
      is_fiat: true,
  },
  {
      _id: "CNY",
      title: {
          en: "Yuan",
          ru: "Юань",
          uk: "Юань"
      },
      symbol: "¥",
      flag: "🇨🇳",
      is_crypto: false,
      is_fiat: true,
  },
  {
      _id: "RSD",
      title: {
          en: "Dinar",
          ru: "Динар",
          uk: "Дiнар"
      },
      symbol: "дин",
      flag: "🇷🇸",
      is_crypto: false,
      is_fiat: true,
  },
  {
      _id: "THB",
      title: {
          en: "Baht",
          ru: "Бат",
          uk: "Бат"
      },
      symbol: "฿",
      flag: "🇹🇭",
      is_crypto: false,
      is_fiat: true,
  },
  {
      _id: "ZAR",
      title: {
          en: "Rand",
          ru: "Рэнд",
          uk: "Рэнд"
      },
      symbol: "R",
      flag: "🇿🇦",
      is_crypto: false,
      is_fiat: true,
  },
  {
      _id: "AED",
      title: {
          en: "Dirham",
          ru: "Дирхам",
          uk: "Дiрхам"
      },
      symbol: "Dh",
      flag: "🇦🇪",
      is_crypto: false,
      is_fiat: true,
  },
  {
      _id: "SCR",
      title: {
          en: "Rupee",
          ru: "Рупии",
          uk: "Рупии"
      },
      symbol: "Rs",
      flag: "🇸🇨",
      is_crypto: false,
      is_fiat: true,
  },
  {
      _id: "DZD",
      title: {
          en: "Dinar",
          ru: "Динар",
          uk: "Дiнар"
      },
      symbol: "DA",
      flag: "🇩🇿",
      is_crypto: false,
      is_fiat: true,
  },
  {
      _id: "INR",
      title: {
          en: "Rupee",
          ru: "Рупии",
          uk: "Рупии"
      },
      symbol: "₹",
      flag: "🇮🇳",
      is_crypto: false,
      is_fiat: true,
  },
  {
      _id: "IDR",
      title: {
          en: "Rupee",
          ru: "Рупии",
          uk: "Рупии"
      },
      symbol: "Rp",
      flag: "🇮🇩",
      is_crypto: false,
      is_fiat: true,
  },
  {
      _id: "ILS",
      title: {
          en: "Shekel",
          ru: "Шекели",
          uk: "Шекелi"
      },
      symbol: "₪",
      flag: "🇮🇱",
      is_crypto: false,
      is_fiat: true,
  }
]


const transliterate = (word: string) => {
  const a = {"Ё":"YO","Й":"I","Ц":"TS","У":"U","К":"K","Е":"E","Н":"N","Г":"G","Ш":"SH","Щ":"SCH","З":"Z","Х":"H","Ъ":"","ё":"yo","й":"i","ц":"ts","у":"u","к":"k","е":"e","н":"n","г":"g","ш":"sh","щ":"sch","з":"z","х":"h","ъ":"","Ф":"F","Ы":"I","В":"V","А":"A","П":"P","Р":"R","О":"O","Л":"L","Д":"D","Ж":"ZH","Э":"E","ф":"f","ы":"i","в":"v","а":"a","п":"p","р":"r","о":"o","л":"l","д":"d","ж":"zh","э":"e","Я":"Ya","Ч":"CH","С":"S","М":"M","И":"I","Т":"T","Ь":"","Б":"B","Ю":"YU","я":"ya","ч":"ch","с":"s","м":"m","и":"i","т":"t","ь":"","б":"b","ю":"yu"}
  return word.split('').map(char => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return a[char] || char
  }).join('')
}

const generateUser = (_name: string): TUser => {
  return {
    _id: Math.round(Math.random() * 1e10),
    first_name: _name,
    last_name: _name,
    // fullName: (_name + ' ').repeat(2/*1 + Math.floor(Math.random() * 2)*/),
    username: Math.random() > 0.2 ? transliterate(_name).toLowerCase() : undefined,
    profile_photo: Math.random() < 0.5 ? null : `https://i.pravatar.cc/48/${Math.round(Math.random() * 1e10)}`,
    _name,
  }
}

const generateName = () => {
  const names = i18n.language === 'ru'
    ? ["Александр", "Дмитрий", "Максим", "Сергей", "Андрей", "Алексей", "Артём", "Илья", "Кирилл", "Михаил", "Никита", "Матвей", "Роман", "Егор", "Арсений", "Иван", "Денис", "Евгений", "Тимофей", "Владислав", "Игорь", "Владимир", "Павел", "Руслан", "Марк", "Константин", "Тимур", "Олег", "Ярослав", "Антон", "Николай", "Данил", "Анастасия", "Мария", "Анна", "Виктория", "Екатерина", "Наталья", "Марина", "Полина", "София", "Дарья", "Алиса", "Ксения", "Александра", "Елена"]
    : ["Isabelle", "Louis", "Tariq", "Joyce", "Zaid", "Mary", "Rufus", "Ishaq", "Lucy", "Vinnie", "Amelie", "Jaydon", "Beth", "Zackary", "Scott", "Rhonda", "Gilbert", "Ayla", "Dale", "Moshe", "Jon", "Sylvie", "Grover", "Neil", "Lukas", "Amber", "Shreya", "Evan", "Lucinda", "Kareem", "Reid", "Owain", "Liberty", "Cordelia", "Tony", "Ophelia", "Maeve", "Yasir", "Gary", "Daniella", "Keira", "Umar", "Sally", "Oskar", "Lucia", "Dewi", "Bethany", "Marco", "Amna", "Micheal"]
  return names[Math.floor(Math.random() * names.length)]
}

const generateNames = (n: number) => {
  const names: string[] = []
  do {
    const name = generateName()
    if (!names.includes(name)) {
      names.push(name)
    }
  } while (names.length !== n)
  return names
}

const _names = generateNames(6)
const _mockUsers = _names.map(_name => generateUser(_name))

const shares: TShare[] = _mockUsers.slice(0, 4).map((user, i) => ({
  person_id: `Person${i}`,
  raw_name: user._name || '',
  normalized_name: user._name || '',
  related_user_id: Math.random() > 0.3 ? user._id : null,
  is_payer: i == 0,
  // amount: Math.round(Math.random() * 1e2) * 10 ** decimals
  amount: parseFloat((Math.round(Math.random() * 1e4) / 10 ** decimals).toFixed(decimals)),
  is_fixed_amount: true,
}))

shares.splice(1, 0, {
  ...shares[0],
  amount: parseFloat((shares[0].amount / 3).toFixed(decimals)),
  is_payer: false
})

const _mockTransaction: TTransaction = {
  _id: '0',
  chat_id: 0,
  creator_user_id: null,
  editor_user_id: null,
  is_voice: true,
  raw_text: shares.map(share => `${share.normalized_name} ${share.is_payer ? i18n.t('paid') : i18n.t('owes')} ${share.amount/* (share.amount / 10 ** decimals).toFixed(0)*/}` ).join(', '),
  formatted_text: shares.map(share => `<b>${share.normalized_name}</b> ${share.is_payer ? i18n.t('paid') : i18n.t('owes')} ${share.amount}`).join(', '),
  shares,
  is_confirmed: false,
  is_canceled: false,
  is_equally: false,
  currency_id: 'USD',
  time_created: (new Date()).toISOString(),
  nutshell: null,
  category: null,
  is_settleup: false,
  is_personal: false,
  cashback: null,
}

const mockRates = mockCurrencies.reduce((acc, currency) => {
  acc[`USD${currency._id}`] = 1
  return acc
}, {} as TRates)

const _mockChat: TChat = {
  default_currency: 'USD',
  language_code: 'en',
  is_admin: false,
  silent_mode: false,
  rates: mockRates,
  mode: 'family',
  cashback: 0,
  monthly_limit: 0,
  name: 'Demo chat',
}

// demo data

const tgLanguageCode = window.Telegram?.WebApp.initDataUnsafe.user?.language_code
const demoLanguage: TLanguageCode = (tgLanguageCode && i18n.languages.includes(tgLanguageCode))
  ? tgLanguageCode as TLanguageCode
  : 'en'
const isRus = demoLanguage === 'ru'

const demoUsers: TUser[] = [
  {
    _id: 1000,
    first_name: isRus ? 'Павел' : 'Pavel',
    last_name: isRus ? 'Дуров' : 'Durov',
    username: 'underdog',
    profile_photo: avatar0,
  },
  {
    _id: 1001,
    first_name: isRus ? 'Антон' : 'Anton',
    last_name: isRus ? 'Костин' : 'Kostin',
    username: 'ceo_of_everything',
    profile_photo: avatar1,
  },
  {
    _id: 1002,
    first_name: isRus ? 'Егор' : 'George',
    last_name: isRus ? 'Корепанов' : 'Korepanov',
    username: 'gkor',
    profile_photo: avatar2,
  },
  {
    _id: 1003,
    first_name: isRus ? 'Даша' : 'Daria',
    last_name: isRus ? 'Турилова' : 'Turilova',
    username: 'dariadesign',
    profile_photo: avatar3,
  },
  {
    _id: 1004,
    first_name: isRus ? 'Карим' : 'Karim',
    last_name: isRus ? 'Искаков' : 'Iskakov',
    username: 'karim_official',
    profile_photo: avatar4,
  },
]

const demoTransaction: TTransaction = {
  _id: 'demo-tx',
  chat_id: 0,
  creator_user_id: null,
  editor_user_id: null,
  is_voice: true,
  raw_text: isRus
    ? 'Антон заплатил 4500 рублей за Пашу, Егора, Дашу и Карима в ресторане. Егор оставил 700 рублей чаевыми. Делим счёт поровну.'
    : 'Anton paid 45 dollars for Pavel, George, Dasha and Karim in restaurant. George left 10 dollars tips. Split bill equally.',
  formatted_text:  isRus
  ? '<b>Антон</b> заплатил 4500 рублей за <b>Пашу</b>, <b>Егора</b>, <b>Дашу</b> и <b>Карима</b> в ресторане. <b>Егор</b> оставил 700 рублей чаевыми. Делим счёт поровну.'
  : '<b>Anton</b> paid 45 dollars for <b>Pavel</b>, <b>George</b>, <b>Dasha</b> and <b>Karim</b> in restaurant. <b>George</b> left 10 dollars tips. Split bill equally.',
  is_confirmed: false,
  is_canceled: false,
  is_equally: true,
  currency_id: isRus ? 'RUB' : 'USD',
  shares: [
    {
      person_id: `Person-1`,
      raw_name: demoUsers[1].first_name,
      normalized_name: demoUsers[1].first_name,
      related_user_id: demoUsers[1]._id,
      is_payer: true,
      amount: isRus ? 4500 : 45,
      is_fixed_amount: false,
    },
    {
      person_id: `Person-2`,
      raw_name: demoUsers[2].first_name,
      normalized_name: demoUsers[2].first_name,
      related_user_id: demoUsers[2]._id,
      is_payer: true,
      amount: isRus ? 700 : 10,
      is_fixed_amount: false,
    },

    {
      person_id: `Person-0`,
      raw_name: demoUsers[0].first_name,
      normalized_name: demoUsers[0].first_name,
      related_user_id: demoUsers[0]._id,
      is_payer: false,
      amount: isRus ? 1040 : 11,
      is_fixed_amount: false,
    },
    {
      person_id: `Person-2`,
      raw_name: demoUsers[2].first_name,
      normalized_name: demoUsers[2].first_name,
      related_user_id: demoUsers[2]._id,
      is_payer: false,
      amount: isRus ? 1040 : 11,
      is_fixed_amount: false,
    },
    {
      person_id: `Person-3`,
      raw_name: demoUsers[3].first_name,
      normalized_name: demoUsers[3].first_name,
      related_user_id: demoUsers[3]._id,
      is_payer: false,
      amount: isRus ? 1040 : 11,
      is_fixed_amount: false,
    },
    {
      person_id: `Person-4`,
      raw_name: demoUsers[4].first_name,
      normalized_name: demoUsers[4].first_name,
      related_user_id: demoUsers[4]._id,
      is_payer: false,
      amount: isRus ? 1040 : 11,
      is_fixed_amount: false,
    },
    {
      person_id: `Person-1`,
      raw_name: demoUsers[1].first_name,
      normalized_name: demoUsers[1].first_name,
      related_user_id: demoUsers[1]._id,
      is_payer: false,
      amount: isRus ? 1040 : 11,
      is_fixed_amount: false,
    },
  ],
  time_created: (new Date()).toISOString(),
  nutshell: null,
  category: null,
  is_settleup: false,
  is_personal: false,
  cashback: null,
}

const demoCurrencyId = isRus ? 'RUB' : 'USD'

const demoChat: TChat = {
  default_currency: demoCurrencyId,
  language_code: demoLanguage,
  is_admin: false,
  silent_mode: false,
  rates: mockRates,
  mode: 'family',
  cashback: 0,
  monthly_limit: 0,
  name: isRus ? 'Демо-чат' : 'Demo chat',
}

const isDemo = true
const mockUsers = isDemo ? demoUsers : _mockUsers
const mockTransaction = isDemo ? demoTransaction : _mockTransaction
const mockChat = isDemo ? demoChat : _mockChat

const mockSummary: TSummary = {
  chat_id: 0,
  url: 'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit',
  debts: mockUsers.map((mockUser, i, arr) => (
    {
      from_user: mockUser,
      to_user: arr[(i === arr.length - 1) ? 0 : i + 1],
      amount: parseFloat((Math.round(Math.random() * (isRus ? 1e6 : 1e5)) / 10 ** decimals).toFixed(decimals)),
      currency_id: demoCurrencyId /* || mockCurrencies[Math.floor(Math.random() * 3)]._id,*/
    }
  )),
}

const mockTransactions: TTransaction[] = mockSummary.debts.map((debt, i) => ({
  _id: `demo-tx-${i}`,
  chat_id: 0,
  creator_user_id: null,
  editor_user_id: null,
  is_voice: false,
  raw_text: '',
  formatted_text: '',
  is_confirmed: true,
  is_canceled: false,
  is_equally: true,
  currency_id: debt.currency_id,
  shares: [
    {
      person_id: `Person-1`,
      raw_name: debt.to_user.first_name,
      normalized_name: debt.to_user.first_name,
      related_user_id: debt.to_user._id,
      is_payer: true,
      amount: debt.amount,
      is_fixed_amount: false,
    },
    {
      person_id: `Person-2`,
      raw_name: debt.from_user.first_name,
      normalized_name: debt.from_user.first_name,
      related_user_id: debt.from_user._id,
      is_payer: false,
      amount: debt.amount,
      is_fixed_amount: false,
    },
  ],
  time_created: (new Date(+(new Date) - i)).toISOString(),
  nutshell: i === 0
    ? (isRus ? 'Расчёт' : 'Settle up')
    : (isRus ? 'Демо-трата' : 'Demo transaction'),
  category: i === 0
    ? 'paid'
    : ['financial_expenses', 'food_drinks', 'housing', 'income', 'investments', 'life_entertainment', 'shopping', 'transportation', 'utilities'][Math.floor(Math.random() * 10)],
  is_settleup: false,
  is_personal: false,
  cashback: i === 0 ? 0.05 : null,
}))

const mockAllPayoffMethods: TPayoffMethods = {
  'tbank': {
    title: 'T-bank',
    type: 'bank',
    image: 'https://cdn.tbank.ru/static/pages/files/d39e9d26-fd5e-4574-9ad3-c3f2fc102598.png',
    fields: {
      'payment_link': {
        type: 'string',
        is_optional: false,
      },
    }
  },
  'wise': {
    title: 'Wise',
    type: 'bank',
    image: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/63d71b75-8de4-4d45-aa71-c8efaf8ec263',
    fields: {
      'payment_link': {
        type: 'string',
        is_optional: false,
      },
    }
  },
  'usdt_trc20': {
    title: 'USDT TRC20',
    type: 'crypto',
    image: 'https://cdn.worldvectorlogo.com/logos/tether.svg',
    fields: {
      'address': {
        type: 'string',
        is_optional: false,
      }
    }
  },
  'btc': {
    title: 'Bitcoin',
    type: 'crypto',
    image: 'https://cryptologos.cc/logos/bitcoin-btc-logo.svg',
    fields: {
      'address': {
        type: 'string',
        is_optional: false,
      }
    },
  },
}

const mockMyPayoffMethods: TUserPayoffMethod[] = [
  {
    id: 'mock-user-payoff-method',
    label: 'btc',
    is_active: true,
    fields: {
      'address': '000000000000000000000000000000000000000000000',
    }
  },
]

export {
  mockUsers,
  mockTransaction,
  mockCurrencies,
  mockChat,
  mockSummary,
  mockTransactions,
  mockAllPayoffMethods,
  mockMyPayoffMethods,
}
