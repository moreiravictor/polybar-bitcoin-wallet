import { data, price, round } from '../commons/dataUtil.js'
import { currency, coins, icons } from '../config/coins.js'
import { getFullInfos, getCoinInfos } from '../http/service/quotesService.js'

function userTotalCoin(coin) {
    return coins[coin.slug] * price(coin, currency)
}

function finalTemplate(coin) {
    return `${icons[coin.slug]} ${round(price(coin, currency))} (${round(coin.user_percentage)}%) `
}

async function priceAndPercentage() {
    const response = await getFullInfos()
    const coins_data = data(response)
    
    coins_data.map(coin => coin.user_total = userTotalCoin(coin))
    const user_total = coins_data.reduce((total, {user_total}) => total + user_total, 0)
    coins_data.map(coin => coin.user_percentage = (coin.user_total/user_total)*100)
    
    let result = ''
    coins_data.forEach( coin => result += finalTemplate(coin))
    return result
}

async function userTotal() {
    const response = await getFullInfos()
    const coins_data = data(response)

    coins_data.map(coin => coin.user_total = userTotalCoin(coin))
    const user_total = coins_data.reduce((total, {user_total}) => total + user_total, 0)
    return `${round(user_total)} ${currency}`
}

async function convert(options) {
    const cripto = options[1]
    const amount = options[2] || coins[cripto]

    const res = await getCoinInfos(currency, cripto)
    const converted = price(data(res)[0], currency) * amount
    return `${round(converted)} BRL`
}

async function quote(options) {
    const cripto = options[1]
    const res = await getCoinInfos(currency, cripto)
    const quoted = price(data(res)[0], currency)
    return `${round(quoted)} BRL`
}

export {
    priceAndPercentage, 
    userTotal,
    convert,
    quote
}

