function cambioPagina(boton, enlace){
    $(boton).click(()=>{
        window.location.href = enlace;
    })
}

function avanzarNavbar() {
    $('#user__btnBilletera').click(() => {
        $('html, body').animate({scrollTop: 0}, 1000);
    });

    $('#user__btnMercado').click(() => {
        avanzarBody('#activos')
    });
}


// -------------------------------------- //

function scrollFinal (){
    let tabla = $('#activos__lista');

    $(document).scroll(()=>{
        let seccionActual = window.location.hash;

        if(seccionActual == '#2'){
            $(tabla).hover(()=>{
                deshabilitarScrollify();
                scrollTabla()
                deshabilitarScroll();
            }, ()=>{
                habilitarScroll()
                habilitarScrollify();
            })
        }
    })
}
function scrollTabla (){
    $.scrollify.instantMove('#activos__lista')
}
function deshabilitarScroll(){
    let top = $('#activos');
    top = top[0].offsetHeight;
    
    window.onscroll = () =>{
        window.scrollTo(0, top)
    }
}
function habilitarScroll (){
    window.onscroll = null;
}


// ---------------------------------------------- //
// ---------------------------------------------- //
// ---------------------------------------------- //


function cambioMuestraDivisa(){
    let selector = $('#activos__cabecera--divisas');
    
    $(selector).change(()=>{
        let monedaElegida = $('#activos__cabecera--divisas option:selected').text();
        monedaElegida = monedaElegida.toLowerCase();
        getAjaxModMercado(monedaElegida)
    })
}

function armadoDeTabla(resultado, moneda){
    i=0
    let arrayCriptos = [];
    resultado.forEach((cripto)=>{
        
        let criptoNombre = cripto.id;
        let criptoImagen = cripto.image;
        let criptoPar = parDeConversion(cripto, moneda);

        let criptoPrecio = cripto.current_price;
        let cambio = cripto.price_change_percentage_24h;
        let criptoCambio = porcentajeDeCambio(cambio)

        let criptoMax = cripto.high_24h;
        let criptoMin = cripto.low_24h;
        let criptoVol = grandesCantidades(cripto.total_volume);

        crearTr('tbody', 'activo__cuerpo');
        let criptoPosicion = armarTr(criptoNombre, criptoImagen, criptoPar, criptoPrecio, criptoCambio, criptoMax, criptoMin, criptoVol, i);
        arrayCriptos.push(criptoPosicion)
        i++;
    })
    accionarBtnLista()
}

function modificarTabla(resultado, moneda){
    let i=0;
    resultado.forEach((cripto)=>{
        let criptoPar = parDeConversion(cripto, moneda);

        let criptoPrecio = cripto.current_price;
        let cambio = cripto.price_change_percentage_24h;
        let criptoCambio = porcentajeDeCambio(cambio)

        let criptoMax = cripto.high_24h;
        let criptoMin = cripto.low_24h;
        let criptoVol = grandesCantidades(cripto.total_volume);

        modificarElementosDeTabla(criptoPar, criptoPrecio, criptoCambio, criptoMax, criptoMin, criptoVol, i);
        i++;
    })
}

function modificarElementosDeTabla(par, precio, cambio, max, min, vol, i){
    let classPar = $('.parCriptoLista')
    let classPrecio = $('.activo__cuerpo--precio')
    let classCambio = $('.activo__cuerpo--cambio')
    let classMax = $('.activo__cuerpo--max')
    let classMin = $('.activo__cuerpo--min')
    let classVol = $('.activo__cuerpo--vol')


    modificarElemento(classPar[i], par)
    modificarElemento(classPrecio[i], precio)
    modificarElemento(classCambio[i], cambio)
    modificarElemento(classMax[i], max)
    modificarElemento(classMin[i], min)
    modificarElemento(classVol[i], vol)

}

// --------------------------------------------- //


function armarTr (nombre, logo, par, precio, cambio, max, min, vol, i){

    crearElemento('.activo__cuerpo', 'td', 'class', 'activo__cuerpo__par', '', i);
    crearDivClassPadre('.activo__cuerpo__par', 'class', 'activo__cuerpo--nombre', i)

    crearImagen('.activo__cuerpo--nombre', logo, 'class', 'imagenCripto', i)
    crearElemento('.activo__cuerpo--nombre', 'td', 'class', 'parCriptoLista', par, i);

    crearElemento('.activo__cuerpo', 'td', 'class', 'activo__cuerpo--precio', precio, i);
    crearElemento('.activo__cuerpo', 'td', 'class', 'activo__cuerpo--cambio', cambio, i);
    crearElemento('.activo__cuerpo', 'td', 'class', 'activo__cuerpo--max', max, i);
    crearElemento('.activo__cuerpo', 'td', 'class', 'activo__cuerpo--min', min, i);
    crearElemento('.activo__cuerpo', 'td', 'class', 'activo__cuerpo--vol', vol, i);

    crearElemento('.activo__cuerpo', 'td', 'class', 'activo__cuerpo--input', '', i)
    crearBtn('.activo__cuerpo--input', 'class', 'activo__cuerpo--btn', i)

    let criptoPosicion = [nombre, logo];
    return criptoPosicion;
}

// --------------------------------------------- //

function crearBtn (padre, attr, nombreAttr, i){
    let nuevoNodo, nodoPadre;
    nodoPadre = $(padre);
    nuevoNodo = document.createElement('a');
    contenidoTexto = document.createTextNode('Operar');
    $(nuevoNodo).append(contenidoTexto);

    $(nuevoNodo).attr('href', 'compraVenta.html');
    $(nuevoNodo).attr('role', 'button');
    $(nuevoNodo).attr(attr, nombreAttr);

    $(nodoPadre[i]).append(nuevoNodo)

}


function accionarBtnLista(){
    for(let i=0; i<25; i++){
        let btn = $('.activo__cuerpo--btn')
        $(btn[i]).click(()=>{
            btnLista(i)
        })
    }
}

function btnLista(i){
    let par = $('.parCriptoLista');
    parElegido = $(par[i]).text();
    parElegido = parElegido.toLowerCase();
    console.log(parElegido)
    parElegido = parElegido.split('/');
    parElegido = JSON.stringify(parElegido)
    sessionStorage.setItem('cripto', parElegido);
}

function valorSelectorInicial(){
    let moneda = obtenerSessionStorage('cripto');
    if(moneda == null || moneda == undefined){
        getAjaxMercado('ars')
    }else{
        let monedaInicial = moneda[1];  
        $('#activos__cabecera--divisas').val(monedaInicial)
        getAjaxMercado(monedaInicial)
    }
}

// ---------------------------------------------- //
// -------------DEPOSITO DE DINERO--------------- //
// ---------------------------------------------- //

function accionarDeposito() {
    $('#depositoRetiro__interaccion--depositar').click(()=>{
        depositar();
        mostrarBilletera();
    })
}

function AccionarRetiro(){
    $('#depositoRetiro__interaccion--retirar').click(()=>{
        retirar();
        mostrarBilletera();
    })
}

function eventoInput (id){
    let input;
    input = $(id);
    $(input).keypress(depositarConEnter);
}

// ---------------------------------------------- //
// ----------MOSTRAR/OCULTAR BILLETERAS---------- //
// ---------------------------------------------- //

function mostrarBilletera (){
    let selector = $('.billeteraUser__balance--divisas').val();
    selector = selector.toUpperCase();
    let balanceTotal

    balanceTotal = sumatoriaBilleteraTotal();

    let objetoDivisaElegida = objetoCompletoSelecto(selector, carteraDivisas);
    cantidadBilleteraMostrada = modificarCantidad(objetoDivisaElegida, balanceTotal, '.billeteraUser__balance--cantidad');

}

function mostrarbilleteraSeleccionada (){
    let selector = $('#depositoRetiro__registro--divisas').val();
    selectorValor = selector.toUpperCase();
    let balanceTotal

    if(selector == 'ars'){
        balanceTotal = billeteraPesos.billeteraTotal;
    } else if (selector == 'usd'){
        balanceTotal = billeteraDolares.billeteraTotal;
    } else{
        balanceTotal = billeteraEuros.billeteraTotal;
    }

    objetoDivisaElegida = objetoCompletoSelecto(selectorValor, carteraDivisas);
    cantidadBilleteraMostrada = modificarCantidad(objetoDivisaElegida, balanceTotal, '.depositoRetiro__registro--dinero');
    modificarElemento('#depositoRetiro__interaccion__input--simbolo', objetoDivisaElegida.simbolo)
    getAjaxConvReferencia(selector, balanceTotal)

}

function modificarCantidad({simbolo}, cantidadTotal, ubicacion){
    textoParaMostrar = `${simbolo} ${cantidadTotal}`;
    mostrador = $(ubicacion).text(textoParaMostrar);
    return textoParaMostrar;
}

function modificarMonedaSelecta({simbolo}){
    let billeteraActual = obtenerStorage('billetera');
    billeteraActual = billetera.billeteraTotal;
    
    textoParaMostrar = `${simbolo} ${billeteraActual},00`;
}

function convertirMonedaCriptoRef(cantidad, cripto){
    let criptoValor = cripto[0].current_price;
    criptoValor = parseFloat((cantidad / criptoValor)).toFixed(4);
    return criptoValor
}

function mostrarOcultar (){
    let mensajeOculto = '**************';
    let ojo = $('#ojoUser');

    let selectorBalance = $('.billeteraUser__balance--divisas');
    let selectorRegistro = $('#depositoRetiro__registro--divisas');

    let mostrador = $('.billeteraUser__balance--cantidad').text()
    let cantidadBalance = sumatoriaBilleteraTotal();

    if(mostrador != mensajeOculto){
        $(ojo).attr('class', 'fas fa-eye');
        $(selectorBalance).attr('disabled', '')
        $(selectorRegistro).attr('disabled', '')
        $('.billeteraUser__balance--cantidad').text(mensajeOculto);
        $('.depositoRetiro__registro--dinero').text(mensajeOculto);
        $('.depositoRetiro__registro--btc').text(mensajeOculto);
    } else{
        $(ojo).attr('class', 'fas fa-eye-slash');
        $(selectorBalance).removeAttr('disabled', '')
        $(selectorRegistro).removeAttr('disabled', '')
        $('.billeteraUser__balance--cantidad').text(cantidadBalance);
        mostrarbilleteraSeleccionada();
    }  
}

// ------------------------------------------------- //