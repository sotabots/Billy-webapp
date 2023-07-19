import { TCurrency, TUser } from '../types'

const transliterate = (word: string) => {
  const a = {"Ё":"YO","Й":"I","Ц":"TS","У":"U","К":"K","Е":"E","Н":"N","Г":"G","Ш":"SH","Щ":"SCH","З":"Z","Х":"H","Ъ":"","ё":"yo","й":"i","ц":"ts","у":"u","к":"k","е":"e","н":"n","г":"g","ш":"sh","щ":"sch","з":"z","х":"h","ъ":"","Ф":"F","Ы":"I","В":"V","А":"A","П":"P","Р":"R","О":"O","Л":"L","Д":"D","Ж":"ZH","Э":"E","ф":"f","ы":"i","в":"v","а":"a","п":"p","р":"r","о":"o","л":"l","д":"d","ж":"zh","э":"e","Я":"Ya","Ч":"CH","С":"S","М":"M","И":"I","Т":"T","Ь":"","Б":"B","Ю":"YU","я":"ya","ч":"ch","с":"s","м":"m","и":"i","т":"t","ь":"","б":"b","ю":"yu"}
  return word.split('').map(char => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return a[char] || ''
  }).join('')
}

const generateUser = (name?: string): TUser => {
  const name_ = name || generateName()
  return {
    id: Math.round(Math.random() * 1e10),
    name: (name_ + ' ').repeat(1 + Math.floor(Math.random() * 2)),
    username: transliterate(name_),
    url: `https://i.pravatar.cc/48/${Math.round(Math.random() * 1e10)}`,
  }
}

const generateUserAmount = ({ isPayed }: { isPayed: boolean }) => ({
  ...generateUser(),
  isPayed,
  amount: Math.round(Math.random() * 1e2) // * 1e6) / 100 // todo
})

const generateName = () => {
  const names = ["Александр", "Дмитрий", "Максим", "Сергей", "Андрей", "Алексей", "Артём", "Илья", "Кирилл", "Михаил", "Никита", "Матвей", "Роман", "Егор", "Арсений", "Иван", "Денис", "Евгений", "Тимофей", "Владислав", "Игорь", "Владимир", "Павел", "Руслан", "Марк", "Константин", "Тимур", "Олег", "Ярослав", "Антон", "Николай", "Данил", "Анастасия", "Мария", "Анна", "Виктория", "Екатерина", "Наталья", "Марина", "Полина", "София", "Дарья", "Алиса", "Ксения", "Александра", "Елена"]
  return names[Math.floor(Math.random() * names.length)]
}

const generateUserRelation = () => {
  const name = generateName()
  return ({
    title: name,
    user: Math.random() > 0.5 ? generateUser(name) : undefined,
  })
}

const mockUsers = [
  generateUser(),
  generateUser(),
  generateUser(),
  generateUser(),
  generateUser(),
]

const mockUserRelations = [
  generateUserRelation(),
  generateUserRelation(),
  generateUserRelation(),
  generateUserRelation()
]

const mockTransaction = [
  generateUserAmount({ isPayed: true }),
  generateUserAmount({ isPayed: true }),
  generateUserAmount({ isPayed: false }),
  generateUserAmount({ isPayed: false }),
]

const mockCurrencies: TCurrency[] = [
  {
    id: 'rouble',
    title: 'Рубль',
    symbol: '₽',
    in: 'В рублях'
  },
  {
    id: 'lari',
    title: 'Лари',
    symbol: '₾',
    in: 'В лари'
  },
  {
    id: 'lyra',
    title: 'Лира',
    symbol: '₺',
    in: 'В лирах'
  },
  {
    id: 'euro',
    title: 'Евро',
    symbol: '€',
    in: 'В евро'
  },
]

export {
  generateUser,
  generateUserAmount,
  generateUserRelation,
  mockUsers,
  mockUserRelations,
  mockTransaction,
  mockCurrencies
}
