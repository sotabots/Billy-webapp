import mixpanel from 'mixpanel-browser'

const NO_TOKEN = 'NO_TOKEN'
const token = NO_TOKEN
const isToken = token === NO_TOKEN

const EVENT = {
  OPEN_WEBAPP: 'open_webapp',
  SEND_TRANSACTION: 'send_transaction'
}

const feedback = async (event: string) => {
  if (isToken) {
    console.info('[mixpanel]', event)
    await mixpanel.track(event)
  } else {
    console.warn('[mixpanel: no token]', event)
  }
}

mixpanel.init(token, {
  // debug: true,
  loaded: () => {
    feedback(EVENT.OPEN_WEBAPP)
  }
})


export { feedback, EVENT }
