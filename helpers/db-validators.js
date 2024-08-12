const { Role, 
        AdmService, 
        User,
        Auction } = require('../server')

const isValidRole = async (role = '') => {
    const existRole = await Role.findOne({ role });
    if ( !existRole ){
        throw new Error(`El rol ${ role } no está registrado en BD`)
    }
}

const existEmailByAdmService = async( email = '') => {

    // Verifica si el correo existe
    const existEmail = await AdmService.findOne({ email })
    if ( existEmail ) {
        throw new Error(`El correo: ${ email }, ya está registrado`)
    }
}

const existEmailByUser = async( email = '') => {

    // Verifica si el correo existe
    const existEmail = await User.findOne({ email })
    if ( existEmail ) {
        throw new Error(`El correo: ${ email }, ya está registrado`)
    }
}

const existUserById = async ( id ) => {

    const existUser = await User.findById(id)
    if ( !existUser ) {
        throw new Error(`El id: ${ id }, no existe`)
    }
}

const existAuctionById = async ( id ) => {

    const existAuction = await Auction.findById(id)
    if ( !existAuction ) {
        throw new Error(`El id: ${ id }, no existe`)
    }
}

const existAdmServiceById = async ( id ) => {

    const existAdmService = await AdmService.findById(id)
    if ( !existAdmService ) {
        throw new Error(`El id: ${ id }, no existe`)
    }
}

/**
 * Valida colecciones permitidas  
 */
const allowedCollections = ( collection = '', collections = []) => {

    const include = collections.includes( collection )
    if ( !include ){
        throw new Error(`La colección ${ collection } no es permitida, ${ collections }`)
    }

    return true;
}

module.exports = {
    isValidRole,
    existEmailByAdmService,
    existEmailByUser,
    existUserById,
    existAdmServiceById,
    existAuctionById,
    allowedCollections
}