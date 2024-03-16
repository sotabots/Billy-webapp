import { TShare, TTransaction, TUser, TChat, TSummary } from '../types'
import { mockCurrencies } from './mockCurrencies'

import { decimals } from '../const'

import i18n from '../i18n'

import avatar0 from '../assets/avatar-0.jpg'
import avatar1 from '../assets/avatar-1.jpg'
import avatar2 from '../assets/avatar-2.jpg'
import avatar3 from '../assets/avatar-3.jpg'
import avatar4 from '../assets/avatar-4.jpg'

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
  user_candidates: null,
}))

shares.splice(1, 0, {
  ...shares[0],
  amount: parseFloat((shares[0].amount / 3).toFixed(decimals)),
  is_payer: false
})

const _mockTransaction: TTransaction = {
  _id: '0',
  chat_id: null,
  creator_user_id: null,
  is_voice: true,
  raw_text: shares.map(share => `${share.normalized_name} ${share.is_payer ? i18n.t('paid') : i18n.t('owes')} ${share.amount/* (share.amount / 10 ** decimals).toFixed(0)*/}` ).join(', '),
  formatted_text: shares.map(share => `<b>${share.normalized_name}</b> ${share.is_payer ? i18n.t('paid') : i18n.t('owes')} ${share.amount}`).join(', '),
  shares,
  is_confirmed: false,
  currency_id: mockCurrencies[0]._id
}

const _mockChat: TChat = {
  default_currency: mockCurrencies[0]._id,
  language_code: 'en'
}

// demo data

const tgLanguageCode = window.Telegram?.WebApp.initDataUnsafe.user?.language_code || 'en'
const isRus = tgLanguageCode === 'ru' || tgLanguageCode === 'uk'

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
  _id: '0',
  chat_id: null,
  creator_user_id: null,
  is_voice: true,
  raw_text: isRus
    ? 'Антон заплатил 4500 рублей за Пашу, Егора, Дашу и Карима в ресторане. Егор оставил 700 рублей чаевыми. Делим счёт поровну.'
    : 'Anton paid 45 dollars for Pavel, George, Dasha and Karim in restaurant. George left 10 dollars tips. Split bill equally.',
  formatted_text:  isRus
  ? '<b>Антон</b> заплатил 4500 рублей за <b>Пашу</b>, <b>Егора</b>, <b>Дашу</b> и <b>Карима</b> в ресторане. <b>Егор</b> оставил 700 рублей чаевыми. Делим счёт поровну.'
  : '<b>Anton</b> paid 45 dollars for <b>Pavel</b>, <b>George</b>, <b>Dasha</b> and <b>Karim</b> in restaurant. <b>George</b> left 10 dollars tips. Split bill equally.',
  is_confirmed: false,
  currency_id: isRus ? 'RUB' : 'USD',
  shares: [
    {
      person_id: `Person-1`,
      raw_name: demoUsers[1].first_name,
      normalized_name: demoUsers[1].first_name,
      related_user_id: demoUsers[1]._id,
      is_payer: true,
      amount: isRus ? 4500 : 45,
      user_candidates: null,
    },
    {
      person_id: `Person-2`,
      raw_name: demoUsers[2].first_name,
      normalized_name: demoUsers[2].first_name,
      related_user_id: demoUsers[2]._id,
      is_payer: true,
      amount: isRus ? 700 : 10,
      user_candidates: null,
    },

    {
      person_id: `Person-0`,
      raw_name: demoUsers[0].first_name,
      normalized_name: demoUsers[0].first_name,
      related_user_id: demoUsers[0]._id,
      is_payer: false,
      amount: isRus ? 1040 : 11,
      user_candidates: null,
    },
    {
      person_id: `Person-2`,
      raw_name: demoUsers[2].first_name,
      normalized_name: demoUsers[2].first_name,
      related_user_id: demoUsers[2]._id,
      is_payer: false,
      amount: isRus ? 1040 : 11,
      user_candidates: null,
    },
    {
      person_id: `Person-3`,
      raw_name: demoUsers[3].first_name,
      normalized_name: demoUsers[3].first_name,
      related_user_id: demoUsers[3]._id,
      is_payer: false,
      amount: isRus ? 1040 : 11,
      user_candidates: null,
    },
    {
      person_id: `Person-4`,
      raw_name: demoUsers[4].first_name,
      normalized_name: demoUsers[4].first_name,
      related_user_id: demoUsers[4]._id,
      is_payer: false,
      amount: isRus ? 1040 : 11,
      user_candidates: null,
    },
    {
      person_id: `Person-1`,
      raw_name: demoUsers[1].first_name,
      normalized_name: demoUsers[1].first_name,
      related_user_id: demoUsers[1]._id,
      is_payer: false,
      amount: isRus ? 1040 : 11,
      user_candidates: null,
    },
  ]
}

const demoChat: TChat = {
  default_currency: isRus ? 'RUB' : 'USD',
  language_code: tgLanguageCode
}

const isDemo = true
const mockUsers = isDemo ? demoUsers : _mockUsers
const mockTransaction = isDemo ? demoTransaction : _mockTransaction
const mockChat = isDemo ? demoChat : _mockChat

const mockSummary: TSummary = {
  chat_id: 0,
  url: 'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit',
  debts: Math.random() < 0.2
    ? []
    : mockUsers.map((mockUser, i, arr) => (
      {
        from_user: mockUser,
        to_user: arr[(i === arr.length - 1) ? 0 : i + 1],
        amount: parseFloat((Math.round(Math.random() * 1e6) / 10 ** decimals).toFixed(decimals)),
        currency_id: mockCurrencies[Math.floor(Math.random() * 3)]._id
      }
    )),
}

export {
  mockUsers,
  mockTransaction,
  mockCurrencies,
  mockChat,
  mockSummary,
}
