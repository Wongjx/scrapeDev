
function parseDurianPrice(inputString){
    // const results = katong227durian.d7.exec(inputString);
    // const testRegex = /.*Jin feng *\$(\d+)(?: *per)? *kg/;
    const vendor = goldenIndex["durianempiresg"];
    for(durianReg in vendor){
        console.log(vendor[durianReg].exec(inputString));
    }
}

const goldenIndex = {
    leongteedurian : {
        d1: /\d+(?=kg.*Mao Shan Wang Durian)/
    },
    "227katongdurian" : {
        d1: /(?<=MSW \/ Old Tree MSW *)\$(\d+)\/kg \/ \$(\d+)\/kg/,
        d8: /(?<=Golden Phoenix *)\$(\d+)\/kg/,
        d18: /(?<=Tawa *)\$(\d+)\/kg/,
        d13: /(?<=Green Bamboo *)\$(\d+)\/kg/,
        d11: /(?<=Black Pearl *)\$(\d+)\/kg/,
        d12: /(?<=XO *)\$(\d+)\/kg/,
        d15: /(?<=Kampung *)\$(\d+)\/kg/,
        d14: /(?<=Hu Lu Wang \(葫芦王\) *)\$(\d+)\/kg/,
        "d4 d5 d7": /(?<=D13, D1 & Red Prawn *)\$(\d+)\/kg/
    },
    AhSengDurian:{
        d1: /.*MSW(?: at)? *\$?(\d+)\/kg/,
        d8: /.*Golden Phoenix(?: at)? *\$?(\d+)\/kg/,
        d11: /.*Black Pearl(?: at)? *\$?(\d+)\/kg/,
        d16: /.*Ganghai(?: at)? *\$?(\d+)\/kg/,
        d15: /.*D13(?: at)? *\$?(\d+)\/kg/
    },

    "Combat-Durian-Balestier-Singapore-159016387480898":{
        d1: /.*Msw *\$(\d+)/,
        d8: /.*Jin feng *\$(\d+)/,
        d7: /.*Red prawn *\$(\d+)/,
    },
    "durianempiresg":{
        d3: /.*Msw\(JB\)(?:\s+\S*\s+)?\s*\$?(\d+)\/kg/,
        d2: /.*Pahang Msw *\$?(\d+)\/kg/,
        d8: /.*JiNFeng *\$?(\d+)\/kg/,
        d7: /.*Redprawn *\$?(\d+)\/kg/,
        d14: /.*HU LU\s*\$?(\d+)\/kg/,
        d17: /.*S17(?:\s+\S*\s+)?\s*\$?(\d+)\/kg/,
        d12: /.*Johor XO\s*\$?(\d+)\/kg/,
        d11: /.*Black pearl\s*\$?(\d+)\/kg/,
    }
}


parseDurianPrice(`Wednesday ——Open @530pm
⬇️⬇️⬇️🤜 Knock down deals ! ! ⚡️⚡️⚡️
🔥🔥🎱Black pearl Buy 2️⃣get 1️⃣free
@$13kg （ 买2 送 1）

🔥🔥😺Msw(JB) 13/kg 5kg $65

😻Punggol signatures Msw $18/kg
🔥🔥🔥（5️⃣kg + 1️⃣kg jb msw free) $90

🎋Green Bamboo 5️⃣kg + 1️⃣kg free $70
$14/kg

🦐 Redprawn $12/kg

👩🏻‍🎤 JiNFeng $18/kg
(5️⃣kg Free 1️⃣kg Black Pearl )

😽Pahang Msw $18/kg

🙀Pahang Awesome Msw $21/kg👍👍👍
(5kg free 1 Black Pearl Durian )


🚨 Delivery ⬇️⬇️

Limited today due to durian event 🙏
Reservations n walk in welcome 😊

Can pm us 😊
Limited slot

As is Peak season now , Our slots are limited to avoid any quality or delivery timing delay etc issue ..
Thank you all 🙏

Promo pricing for walk-in/Reserved

🤳🏽For Reservations can pm us

Time of collection :
Types of durians :
No. Of durians :`);