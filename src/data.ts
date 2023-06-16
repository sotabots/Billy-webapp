const generateUser = () => {
  return {
    id: Math.round(Math.random() * 1e10),
    name: 'Name '.repeat(1 + Math.round(Math.random() * 5)),
    username: 'username',
    url: `https://i.pravatar.cc/${50 + Math.round(Math.random() * 100)}`,
  }
}

const generateUserAmount = () => ({
  ...generateUser(),
  amount: Math.round(Math.random() * 1e6) / 100
})

const generateName = () => {
  const names = ["Александр", "Дмитрий", "Максим", "Сергей", "Андрей", "Алексей", "Артём", "Илья", "Кирилл", "Михаил", "Никита", "Матвей", "Роман", "Егор", "Арсений", "Иван", "Денис", "Евгений", "Тимофей", "Владислав", "Игорь", "Владимир", "Павел", "Руслан", "Марк", "Константин", "Тимур", "Олег", "Ярослав", "Антон", "Николай", "Данил", "Анастасия", "Мария", "Анна", "Виктория", "Екатерина", "Наталья", "Марина", "Полина", "София", "Дарья", "Алиса", "Ксения", "Александра", "Елена"]
  return names[Math.floor(Math.random() * names.length)]
}

const generateUserRelation = () => ({
  title: generateName(),
  user: Math.random() > 0.5 ? generateUser() : undefined,
})

const currencies = [
  {
    value: 'rouble',
    label: '₽ Рубль',
    symbol: '₽',
    in: 'В рублях'
  },
  {
    value: 'lari',
    label: '₾ Лари',
    symbol: '₾',
    in: 'В лари'
  },
  {
    value: 'lyra',
    label: '₺ Лира',
    symbol: '₺',
    in: 'В лирах'
  },
  {
    value: 'euro',
    label: '€ Евро',
    symbol: '€',
    in: 'В евро'
  },
]

export {
  generateUser,
  generateUserAmount,
  generateUserRelation,
  currencies
}
