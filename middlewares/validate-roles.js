const { response } = require('express')

const isAdminRole = ( req, res = response ) => {

    if( !req.admService ) {
        return res.status(500).json({
            msg: 'Se debe verificar el token primero para luego validar el role'
        })
    }

    const { role, name } = req.admService;

    if ( role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: `${ name } no es administrador - No se puede hacer la solicitud`
        });
    }

    next()
}

const hasRole = ( ...roles ) => {

    return (req, res = response, next) => {

        if( !req.admService ) {
            return res.status(500).json({
                msg: 'Se debe verificar el token primero para luego validar el role'
            }) 
        }

        if ( !roles.includes( req.admService.role ) ) {
            return res.status(401).json({
                msg: `El servicio requiere uno de estos roles ${ roles } el tuyo es ${ req.admService.role }`
            })
        }

        next()
    }
}

module.exports = {
    isAdminRole,
    hasRole
}