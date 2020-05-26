// const Jimp = require( 'jimp' )
import * as Jimp from 'jimp'

export async function certifiedGenerator ( userName = 'Name' ){
    const font = await Jimp.loadFont( Jimp.FONT_SANS_32_BLACK )
    const certified = await Jimp.read( './assets/img/certified.png' )
    const areaPrint = await Jimp.read( './assets/img/areaCertified.png' )
    const areaWidthPrint = areaPrint.bitmap.width

    areaPrint.print( font, 0, 28, {
        text: userName,
        alignmentX: await Jimp.HORIZONTAL_ALIGN_CENTER,
      }, areaWidthPrint )
    certified.composite( areaPrint, 237, 422 )

    certified.write( './assets/certified/' + userName + '.png')
}