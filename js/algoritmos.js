
// ----------------- COMIENZO ALGORITMO CON DOM ---------------------- //
let billetera, objetoMoneda;

billetera = obtenerStorage('billetera')
if(billetera == null){
    billetera = new BilleteraParcial('ARS', 0);
}
if(billetera.billeteraTotal > 0){
    habilitarBoton();
    bloquearSeleccionMoneda();
    retirar('botonRetiro');
}

objetoMoneda = objetoCompleto(billetera, carteraDivisas);
objetoMonedaToStorage(objetoMoneda);

let carteraCriptos = [];

// ARMADO DE ESTRUCTURA DINAMICA -- HEADER
panelUsuario = aperturaPanelUser('userIn', 'salir');
mostrarBilletera();
presionaOjo();


// DEPOSITOS Y RETIROS -- VALIDACION DE ACCIONES
monedaDeposito = depositar('botonDeposito');
depositarAutomatico = eventoInput();

// ARMADO DE LISTADO DINAMICO DE CRIPTOS
tomarJson();
opcionCripto();
separacionCriptos();