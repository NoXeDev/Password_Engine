const fs = require('fs')
const readline = require('readline')
const cliProgress = require('cli-progress')
const colors = require('colors')

const b1 = new cliProgress.SingleBar({
    format: 'generation : |' + colors.cyan('{bar}') + '| {percentage}% || {value}/{total}',
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    hideCursor: true
});

var alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('')
var numbers = '0123456789'.split('')
var chars = "£$%ù*µ!§:/;.,?&é'(-è_çà".split('')

var static_lengthc
var static_lengthn

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

rl.question("Characters lengths ? \n> ", function(lengthc){
    rl.question("How many password would you generate ? \n> ", function(lengthn){
        if(isNaN(lengthc) || isNaN(lengthn)){console.log("Sorry, this is not a number"); process.exit(0)}
        static_lengthc = Number(lengthc)
        static_lengthn = Number(lengthn)
        if(static_lengthc > 100){console.log('Too many characters. Limit : 100'); process.exit(0)}
        if(static_lengthn > 10000000){console.log('Too many password. Limit : 10000000'); process.exit(0)}
        rl.close()
    })
})

rl.on('close', () => {
    b1.start(static_lengthn, 0)
    let final_txt = ""
    for(a = 0 ; a<static_lengthn ; a++){
        let passwrd = ""
        for(i = 0 ; i<static_lengthc ; i++){
            type = getRandomInt(0,3)
            if(type == 0){ 
                passwrd += alphabet[getRandomInt(0, alphabet.length)]
            }else if(type == 1){
                passwrd += numbers[getRandomInt(0, numbers.length)]
            }else if(type == 2){
                passwrd += chars[getRandomInt(0, chars.length)]
            }
        }
        final_txt += `${passwrd}\n`
        b1.increment()
    }
    fs.writeFileSync('./passwd.txt', final_txt, 'utf8', function(err) {
        if(err) throw err;
    })
    b1.stop()
    console.log("File -> passwd.txt <- was created at the root of the project")
    process.exit(0)
})
