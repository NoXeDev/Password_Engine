const fs = require('fs')
const readline = require('readline')
const cliProgress = require('cli-progress')
const colors = require('colors')
const loadingBar = new cliProgress.SingleBar({
    format: 'generation : |' + colors.cyan('{bar}') + '| {percentage}% || {value}/{total}',
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    hideCursor: true
})
const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('')
const numbers = '0123456789'.split('')
const chars = "£$%ù*µ!§:/;.,?&é'(-è_çà".split('')

function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min)) + min
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

let passwordLength = ""
let passwordsCount = ""

rl.question("How many characters do you want for your password?\n> ", untrustedPasswordLength => {
    rl.question("How many passwords do you want to generate?\n> ", untrustedPasswordsCount => {
        if (isNaN(untrustedPasswordLength) || isNaN(untrustedPasswordsCount)) {
            console.log("Sorry but it's not a number")
            process.exit(0)
        }
        passwordLength = untrustedPasswordLength
        passwordsCount = untrustedPasswordsCount

        if (passwordLength > 100) {
            console.log('Too many characters. Limit : 100');
            process.exit(0)
        }
        if (passwordsCount > 1_000_000) {
            console.log('Too many passwords. Limit : 1000000');
            process.exit(0)
        }

        rl.close()
    })
})

rl.on('close', () => {
    loadingBar.start(passwordsCount, 0)
    let passwords = ""
    for (let i = 0 ; i < passwordsCount ; i++) {
        let password = ""
        for (let j = 0 ; j < passwordLength ; j++) {
            let type = getRandomInt(0,3)
            if (type == 0) { 
                password += alphabet[getRandomInt(0, alphabet.length)]
            }
            else if (type == 1) {
                password += numbers[getRandomInt(0, numbers.length)]
            }
            else if (type == 2) {
                password += chars[getRandomInt(0, chars.length)]
            }
        }
        passwords += `${password}\n`
        loadingBar.increment()
    }
    fs.writeFileSync('./passwd.txt', passwords, 'utf8', err => {
        if (err) throw err;
    })
    loadingBar.stop()
    console.log("File -> passwd.txt <- was created at the root of the project")
})