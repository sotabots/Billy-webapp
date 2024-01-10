import { TTransaction, TUser } from '../types'
import { mockCurrencies } from './mockCurrencies'

import { decimals } from '../const'

import i18n from '../i18n'

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
    username: Math.random() > 0.2 ? transliterate(_name) : undefined,
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
const mockUsers = _names.map(_name => generateUser(_name))

const shares = mockUsers.slice(0, 4).map((user, i) => ({
  person_id: `Person${i}`,
  normalized_name: user._name,
  related_user_id: Math.random() > 0.3 ? user._id : null,
  is_payer: i == 0,
  // amount: Math.round(Math.random() * 1e2) * 10 ** decimals
  amount: parseFloat((Math.round(Math.random() * 1e4) / 10 ** decimals).toFixed(decimals))
}))
shares.splice(1, 0, {
  ...shares[0],
  amount: parseFloat((shares[0].amount / 3).toFixed(decimals)),
  is_payer: false
})

const mockTransaction: TTransaction = {
  _id: '1',
  chat_id: null,
  is_voice: true,
  raw_text: shares.map(share => `${share.normalized_name} ${share.is_payer ? i18n.t('paid') : i18n.t('owes')} ${share.amount/* (share.amount / 10 ** decimals).toFixed(0)*/}` ).join(', '),
  formatted_text: shares.map(share => `<b>${share.normalized_name}</b> ${share.is_payer ? i18n.t('paid') : i18n.t('owes')} ${share.amount}`).join(', '),
  shares,
  is_confirmed: false,
  currency_id: mockCurrencies[0]._id
}

export {
  mockUsers,
  mockTransaction,
  mockCurrencies
}
