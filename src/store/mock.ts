import { TCurrency, TTransaction, TUser } from '../types'

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
    _name,
    id: Math.round(Math.random() * 1e10),
    first_name: _name,
    last_name: _name,
    // fullName: (_name + ' ').repeat(2/*1 + Math.floor(Math.random() * 2)*/),
    username: transliterate(_name),
    profile_photo: `https://i.pravatar.cc/48/${Math.round(Math.random() * 1e10)}`,
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
  spokenName: user._name,
  user: Math.random() > 0.3 ? user : undefined,
  isPayed: i < 2,
  amount: Math.round(Math.random() * 1e2) // * 1e6) / 100 // todo
}))

const mockCurrencies: TCurrency[] = [
  {
    id: 'RUB',
    title: 'Рубль',
    symbol: '₽',
    in: 'В рублях',
    decimals: 4,
    visibleDecimals: 2
  },
  {
    id: 'GEL',
    title: 'Лари',
    symbol: '₾',
    in: 'В лари',
    decimals: 4,
    visibleDecimals: 2
  },
  {
    id: 'TRY',
    title: 'Лира',
    symbol: '₺',
    in: 'В лирах',
    decimals: 4,
    visibleDecimals: 2
  },
  {
    id: 'EUR',
    title: 'Евро',
    symbol: '€',
    in: 'В евро',
    decimals: 4,
    visibleDecimals: 2
  },
]

const mockTransaction: TTransaction = {
  users: mockUsers,
  text: shares.map(share => `<b>${share.spokenName}</b> ${share.isPayed ? 'заплатил' : 'должен'} ${share.amount}`).join(', '),
  shares,
  currency_id: mockCurrencies[0].id
}

export {
  mockUsers,
  mockTransaction,
  mockCurrencies
}
