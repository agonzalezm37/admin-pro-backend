const { response } = require('express');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');


const Usuario = require('../models/usuario');
const getUsuarios = async(req, res) => {

     const usuarios = await Usuario.find({}, 'nombre email role google');
    res.json({
        ok: true,
        usuarios,
        uid: req.uid

    })
}


const crearUsuario = async (req, res = response) => {

    const {email, password} = req.body;




    try{
        const existeEmail = await Usuario.findOne({email});
        
        if(existeEmail){
            return res.status(400).json({
                ok: false,
                msg: "El correo ya está siendo usado"
            })
        }
        const usuario = new Usuario(req.body);
        //enciptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);
        // guardar usuario


        await usuario.save();

        const token = await generarJWT( usuario.id );


        res.json({
            ok: true,
            usuario,
            token
        });

    }catch(e){
        console.log(e);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        })
    }




}
    // TODO: Validar token y comprobar si el usuario es correcto
const actualizarUsuario = async (req, res = response) => {

    const uid = req.params.id;
    try {
        
        const usuarioDB = await Usuario.findById(uid);

        if(!usuarioDB){
            return res.status(404).json({
                ok:false,
                msg: 'no existe un usuario con ese id'
            });
        }

        // Actualizaciones
        const {password, google, email, ...campos} = req.body;

        if( usuarioDB.email !== email ){
            const existeEmail = await Usuario.findOne({email});
            if(existeEmail){
                return res.status(400).json({
                    ok:false,
                    msg: 'Ya existe un usuario con ese email'
                })
            }

        }

        campos.email = email;

        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, {new: true});

        res.json({
            ok:true,
            msg: 'Entrada actualizada',
            usuario: usuarioActualizado
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg: 'Error inesperado'
        })
    }
}

const borrarUsuario = async (req, res = response) =>{
    const uid = req.params.id

    try {
    

        const usuarioDB = await Usuario.findById(uid);

        if(!usuarioDB){
            return req.status(404).json({
                ok:false,
                msg: 'no existe un usuario con ese id'
            });
        }

        await Usuario.findByIdAndDelete(uid);

        res.json({
            ok:true,
            msg: 'Usuario Borrado',
            uid
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg: "Error al eliminar usuario. Consulte log"
        })
    }

};


module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario
}