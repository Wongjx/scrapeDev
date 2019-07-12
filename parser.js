const goldenIndex = {
    "leongteedurian" : {
        d1: /(\d+)kg\s*Pahang\s*One\s*Old\s*Tree\s*Mao\s*Shan\s*Wang\s*Durian/i
    },
    "227katongdurian" : {
        d1: /(?<=MSW \/ Old Tree MSW *)\$(\d+)\/kg \/ \$(\d+)\/kg/i,
        d8: /(?<=Golden Phoenix *)\$(\d+)\/kg/i,
        d18: /(?<=Tawa *)\$(\d+)\/kg/i,
        d13: /(?<=Green Bamboo *)\$(\d+)\/kg/i,
        d11: /(?<=Black Pearl *)\$(\d+)\/kg/i,
        d12: /(?<=XO *)\$(\d+)\/kg/i,
        d15: /(?<=Kampung *)\$(\d+)\/kg/i,
        d14: /(?<=Hu Lu Wang \(葫芦王\) *)\$(\d+)\/kg/i,
        "d4 d5 d7": /(?<=D13, D1 & Red Prawn *)\$(\d+)\/kg/
    },
    "AhSengDurian":{
        d1: /.*MSW(?: at)? *\$?(\d+)\/kg/i,
        d8: /.*Golden Phoenix(?: at)? *\$?(\d+)\/kg/i,
        d11: /.*Black Pearl(?: at)? *\$?(\d+)\/kg/i,
        d16: /.*Ganghai(?: at)? *\$?(\d+)\/kg/i,
        d15: /.*D13(?: at)? *\$?(\d+)\/kg/
    },
    "Combat-Durian-Balestier-Singapore-159016387480898":{
        d1: /.*Msw\s*\$(\d+)/i,
        d8: /.*Jin\s*feng\s*\$(\d+)/i,
        d7: /.*Red\s*prawn\s*\$(\d+)/i,
    },
    "durianempiresg":{
        d3: /.*Msw\(JB\)(?:\s+\S*\s+)?\s*\$?(\d+)\/kg/i,
        d2: /.*Pahang Msw\s*\$?(\d+)\/kg/i,
        d8: /.*JiNFeng\s*\$?(\d+)\/kg/i,
        d7: /.*Redprawn\s*\$?(\d+)\/kg/i,
        d14: /.*HU\s*LU\s*\$?(\d+)\/kg/i,
        d17: /.*S17(?:\s+\S*\s+)?\s*\$?(\d+)\/kg/i,
        d12: /.*Johor\s*XO\s*\$?(\d+)\/kg/i,
        d11: /.*Black\s*pearl\s*\$?(\d+)\/kg/i,
    },
    "Melvinsdurian":{
        d3: /.*Msw\s*\$?(\d+)\s*per\s*kg/i,
        d5: /.*D13\s*\$?(\d+)\s*per\s*kg/i,
        d6: /.*D101\s*\$?(\d+)\s*per\s*kg/i,
        d7: /.*Red\s*prawn\s*\$?(\d+)\s*per\s*kg/i,
        d8: /.*Jin\s*Feng\s*\$?(\d+)\s*per\s*kg/i,
        d9: /.*Wzw\s*\$?(\d+)\s*per\s*kg/i,
        d10: /.*Black\s*gold\s*\$?(\d+)\s*per\s*kg/i,
        d11: /.*Black\s*pearl\s*\$?(\d+)\s*per\s*kg/i,
        d13: /.*Tekka\s*\$?(\d+)\s*per\s*kg/i,
        d19: /.*Black\s*thorn\s*\$?(\d+)\s*per\s*kg/i
    },
    "durianlingersJK":{
        d2: /.*Pahang\s*Old\s*Tree\s*Msw\s*\$?(\d+)\s*\/\s*kg/i,
        d3: /.*Johor\s*Premium\s*Msw\s*\$?(\d+)\s*\/\s*kg/i,
        d7: /.*Red\s*prawn\s*\$?(\d+)\s*\/\s*kg/i,
        d8: /.*Golden\s*Phoenix\s*\$?(\d+)\s*\/\s*kg/i,
        d11: /.*Black\s*Pearl\s*\$?(\d+)\s*\/\s*kg/i,
        d12: /.*XO\s*Bitter\s*alcoholic\s*\$?(\d+)\s*\/\s*kg/i,
        d14: /.*葫芦王\s*\$?(\d+)\s*\/\s*kg/i,
        d17: /.*d17\s*\$?(\d+)\s*\/\s*kg/i,
    },
    "DurianKakiSG":{
        d2: /.*pahang\s*msw\s*-\s*\$?(\d+)\s*\/\s*kg/i,
        d3: /.*johor\s*msw\s*-\s*\$?(\d+)\s*\/\s*kg/i,
        d5: /.*d13\s*-\s*\$?(\d+)\s*\/\s*kg/i,
        d6: /.*d101\s*-\s*\$?(\d+)\s*\/\s*kg/i,
        d8: /.*jin\s*feng\s*-\s*\$?(\d+)\s*\/\s*kg/i,
        d13: /.*tekka\s*-\s*\$?(\d+)\s*\/\s*kg/i,
        d17: /.*d17\s*-\s*\$?(\d+)\s*\/\s*kg/i,
        d19: /.*black\s*thorn\s*-\s*\$?(\d+)\s*\/\s*kg/i,
        d20: /.*mei\s*qiu\s*-\s*\$?(\d+)\s*\/\s*kg/i,
        d21: /.*kasap\s*-\s*\$?(\d+)\s*\/\s*kg/i,
        d24: /.*d24\s*-\s*\$?(\d+)\s*\/\s*kg/i,
    },
    "thedurianstory":{
        d10: /.*SIGNATURE\s*BLACKGOLD\s*\S*\s*-\s*\$?(\d+)\s*\/?\s*(:?kg)?/i,
        d22: /.*PAHANG\s*OLD\s*TREE\s*KING\s*OF\s*KING\s*\S*\s*-\s*\$?(\d+)\s*\/?\s*(:?kg)?/i,
        d25: /.*BUTTER\s*\S*\s*-\s*\$?(\d+)\s*\/?\s*(:?kg)?/i,
        d2: /.*PAHANG\s*PREMIUM\s*MSW\s*\S*\s*-\s*\$?(\d+)\s*\/?\s*(:?kg)?/i,
        d23: /.*JOHOR\s*OLD\s*TREE\s*KING\s*OF\s*KING\s*\S*\s*-\s*\$?(\d+)\s*\/?\s*(:?kg)?/i,
        d3: /.*JOHOR\s*PREMIUM\s*MSW\s*\S*\s*-\s*\$?(\d+)\s*\/?\s*(:?kg)?/i,
        d8: /.*GOLDEN\s*PHOENIX\s*\S*\s*-\s*\$?(\d+)\s*\/?\s*(:?kg)?/i,
        d13: /.*GREEN\s*BAMBOO\s*\S*\s*-\s*\$?(\d+)\s*\/?\s*(:?kg)?/i,
        d14: /.*HU\s*LU\s*\S*\s*-\s*\$?(\d+)\s*\/?\s*(:?kg)?/i,
        d12: /.*XO\s*\S*\s*-\s*\$?(\d+)\s*\/?\s*(:?kg)?/i,
        d11: /.*BLACKPEARL\s*\S*\s*-\s*\$?(\d+)\s*\/?\s*(:?kg)?/i,
        d7: /.*RED\s*PRAWN\s*\S*\s*-\s*\$?(\d+)\s*\/?\s*(:?kg)?/i,
        d24: /.*XOD24\s*\S*\s*-\s*\$?(\d+)\s*\/?\s*(:?kg)?/i,
        d5: /.*D13\s*\S*\s*-\s*\$?(\d+)\s*\/?\s*(:?kg)?/i
    },
    "Baojiakdurian":{
        d1: /.*MSW\s*(?:AT|@)\s*\$?(\d+)\s*\/\s*kg/i,
        d9: /.*King\s*of\s*Kings\s*(?:AT|@|-)\s*\$?(\d+)\s*\/\s*kg/i,
        d8: /.*Golden\s*Phoenix\s*(?:AT|@|-)\s*\$?(\d+)\s*\/\s*kg/i,
        d6: /.*Old\s*tree\s*101\s*(?:AT|@|-)\s*\$?(\d+)\s*\/\s*kg/i,
        d5: /.*D13\s*(?:AT|@|-)\s*\$?(\d+)\s*\/\s*kg/i,
    }
}

function parseDurianPrice(vendorPageName, inputString){
    // const results = katong227durian.d7.exec(inputString);
    // const testRegex = /.*Jin feng *\$(\d+)(?: *per)? *kg/;
    if(!goldenIndex.hasOwnProperty(vendorPageName)){
        console.error(`Vendor ${vendorPageName} regex not avaliable`);
        return;
    }
    const vendor = goldenIndex[vendorPageName];
    return Object.keys(vendor).map((dNum)=>{
        result = vendor[dNum].exec(inputString);
        return [dNum,result?result[1]:null];
    })
}
module.exports.parseDurianPrice=parseDurianPrice;
// console.log(parseDurianPrice("227katongdurian",`Hi Durians Fans, it’s Friday. Wish everyone a happy Friday.

// We kindly 🙇🏻‍♂ seek your understanding that we may not be able to pick up all calls during this peak period as we are trying to open durians as fast as possible so that you all can satisfy your cravings for durians asap too~

// Please do walk-in to our shop. (We have ❄ air-conditioning seats too!)

// Here are the latest updated price for our durians:

// MSW / Old Tree MSW $17/kg / $20/kg
// Golden Phoenix $16/kg
// Tawa $12/kg
// Green Bamboo $12/kg
// Black Pearl $12/kg
// Hu Lu Wang (葫芦王) $10/kg
// D13, D1 & Red Prawn $8/kg
// Kampung $8/kg`));