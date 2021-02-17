function validarOperacion (mensaje, className){
    let nodoPadre, elemento, contenido;
    elemento = document.createElement('p');
    contenido = document.createTextNode(mensaje);
    elemento.appendChild(contenido);
    elemento.setAttribute('id', 'confirmacion');
    
    nodoPadre = document.getElementsByClassName(className);
    nodoPadre[0].append(elemento)

    setTimeout(() => {
        nodoPadre[0].removeChild(elemento)
    }, 2500);
}


function validacionNumeroReal (){
    valorInput = document.getElementById('deposito-retiro').value 
    if(valorInput <= 0 || valorInput == "" || valorInput == null){
        validarOperacion('Ingrese un numero real.', 'dr');
        valorInput = "";
    } 
}

function billeteraInicial(){
    billetera = obtenerStorage('billetera')
    if(billetera == null || billetera == ""){
        billetera = new BilleteraParcial('ARS', 0);
    }
    return billetera
}

function monedaInicial(){
    moneda = obtenerStorage('moneda');
    if(moneda == null || moneda == ''){
        moneda = carteraDivisas[0]
    }
    return moneda;
}