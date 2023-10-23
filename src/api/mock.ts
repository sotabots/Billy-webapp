import { TCurrency, TTransaction, TUser } from '../types'

export const decimals = 4
export const visible_decimals = 2

const mockCurrencies: TCurrency[] = [
  {
    id: 'RUB',
    title: 'Рубль',
    symbol: '₽',
    in: 'В рублях',
    decimals,
    visible_decimals
  },
  {
    id: 'GEL',
    title: 'Лари',
    symbol: '₾',
    in: 'В лари',
    decimals,
    visible_decimals
  },
  {
    id: 'TRY',
    title: 'Лира',
    symbol: '₺',
    in: 'В лирах',
    decimals,
    visible_decimals
  },
  {
    id: 'EUR',
    title: 'Евро',
    symbol: '€',
    in: 'В евро',
    decimals,
    visible_decimals
  },
]

const transliterate = (word: string) => {
  const a = {"Ё":"YO","Й":"I","Ц":"TS","У":"U","К":"K","Е":"E","Н":"N","Г":"G","Ш":"SH","Щ":"SCH","З":"Z","Х":"H","Ъ":"","ё":"yo","й":"i","ц":"ts","у":"u","к":"k","е":"e","н":"n","г":"g","ш":"sh","щ":"sch","з":"z","х":"h","ъ":"","Ф":"F","Ы":"I","В":"V","А":"A","П":"P","Р":"R","О":"O","Л":"L","Д":"D","Ж":"ZH","Э":"E","ф":"f","ы":"i","в":"v","а":"a","п":"p","р":"r","о":"o","л":"l","д":"d","ж":"zh","э":"e","Я":"Ya","Ч":"CH","С":"S","М":"M","И":"I","Т":"T","Ь":"","Б":"B","Ю":"YU","я":"ya","ч":"ch","с":"s","м":"m","и":"i","т":"t","ь":"","б":"b","ю":"yu"}
  return word.split('').map(char => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return a[char] || ''
  }).join('')
}

const generateUser = (_name: string): TUser => {
  return {
    id: Math.round(Math.random() * 1e10),
    first_name: _name,
    last_name: _name,
    // fullName: (_name + ' ').repeat(2/*1 + Math.floor(Math.random() * 2)*/),
    username: Math.random() > 0.2 ? transliterate(_name) : undefined,
    profile_photo: `https://i.pravatar.cc/48/${Math.round(Math.random() * 1e10)}`,
    _name,
  }
}

const generateName = () => {
  const names = ["Александр", "Дмитрий", "Максим", "Сергей", "Андрей", "Алексей", "Артём", "Илья", "Кирилл", "Михаил", "Никита", "Матвей", "Роман", "Егор", "Арсений", "Иван", "Денис", "Евгений", "Тимофей", "Владислав", "Игорь", "Владимир", "Павел", "Руслан", "Марк", "Константин", "Тимур", "Олег", "Ярослав", "Антон", "Николай", "Данил", "Анастасия", "Мария", "Анна", "Виктория", "Екатерина", "Наталья", "Марина", "Полина", "София", "Дарья", "Алиса", "Ксения", "Александра", "Елена"]
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
  related_user_id: Math.random() > 0.3 ? user.id : undefined,
  is_payer: i == 0,
  amount: Math.round(Math.random() * 1e2) * 10 ** decimals
}))
shares.splice(1, 0, {
  ...shares[0],
  amount: shares[0].amount / 3,
  is_payer: false
})

const mockTransaction: TTransaction = {
  _id: '1',
  chat_id: null,
  is_voice: true,
  raw_text: shares.map(share => `${share.normalized_name} ${share.is_payer ? 'заплатил' : 'должен'} ${(share.amount / 10 ** decimals).toFixed(0)}`).join(', '),
  // formatted_text: shares.map(share => `<b>${share.normalized_name}</b> ${share.is_payer ? 'заплатил' : 'должен'} ${share.amount}`).join(', '),
  shares,
  is_confirmed: false,
  currency_id: mockCurrencies[0].id
}

export {
  mockUsers,
  mockTransaction,
  mockCurrencies
}
