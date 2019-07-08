
function parseDurianPrice(inputString){
    const leongteedurianMSWReg = /\d+(?=kg.*Mao Shan Wang Durian)/;
    const katong227durianMSWReg = /(?<=MSW \/ Old Tree MSW *)\$(\d+)\/kg \/ \$(\d+)\/kg/;
    const katong227durianGPReg = /(?<=Golden Phoenix *)\$(\d+)\/kg/;
    const katong227durianTawaReg = /(?<=Tawa *)\$(\d+)\/kg/;
    const katong227durianGBReg = /(?<=Green Bamboo *)\$(\d+)\/kg/;
    const katong227durianBPReg = /(?<=Black Pearl *)\$(\d+)\/kg/;
    const katong227durianXOReg = /(?<=XO *)\$(\d+)\/kg/;
    const katong227durianKReg = /(?<=Kampung *)\$(\d+)\/kg/;
    const katong227durianHLWReg = /(?<=Hu Lu Wang \(葫芦王\) *)\$(\d+)\/kg/;
    const katong227durianMixedReg = /(?<=D13, D1 & Red Prawn *)\$(\d+)\/kg/;



    const results = katong227durianHLWReg.exec(inputString);
    console.log(results);
}

parseDurianPrice('Hi Durians Fans, happy mid weeks.  Durians are here.  We kindly 🙇🏻‍♂ seek your understanding that we may not be able to pick up all calls during this peak period as we are trying to open durians as fast as possible so that you all can satisfy your cravings for durians asap too~  Please do walk-in to our shop. (We have ❄ air-conditioning seats too!) Here are the latest updated price for our durians:  MSW / Old Tree MSW      $19/kg / $22/kg Golden Phoenix                $17/kg Tawa                                  $12/kg Green Bamboo                 $12/kg Black Pearl                        $12/kg XO                                      $12/kg  Hu Lu Wang (葫芦王)      $10/kg D13, D1 & Red Prawn       $8/kg Kampung                          $8/kg ');