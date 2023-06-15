const generateUser = () => {
  return {
    id: Math.round(Math.random() * 1e10),
    name: 'Name '.repeat(1 + Math.round(Math.random() * 5)),
    username: 'username',
    url: 'https://i.pravatar.cc/50',
  }
}

const generateUserAmount = () => ({
  ...generateUser(),
  amount: Math.round(Math.random() * 1e6) / 100
})

export {
  generateUser,
  generateUserAmount
}
