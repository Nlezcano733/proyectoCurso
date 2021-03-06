// ---------------------------------------------- //
// ----------------NAVEGACION-------------------- //
// ---------------------------------------------- //

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

// -------------------------------------------- //
//           APERTURA MENU RESPONSIVE           //
// -------------------------------------------- //


function accionarMenu (){
    $('#burger-logo').click( e =>{ abrirMenu(e.target.className) });
    $('#user-logo').click( e =>{ abrirMenu(e.target.className) });
}

function abrirMenu (clase){
    if(clase === 'fas fa-bars'){
        $('.billeteraUser').fadeOut();
        $('.navBar').toggle('slide');
        $('.navBar').css('display', 'flex');

        setTimeout(()=>{ 
            $('#burger-logo').attr('class', 'fas fa-times');
            $('#redes').css('display', 'flex')
        }, 400)

        btnClose();
    } else if(clase === 'fas fa-user-circle'){
        $('.navBar').fadeOut();
        $('.billeteraUser').toggle('slide');
        btnClose();

    } else {
        $('.navBar').fadeOut();
        $('.billeteraUser').fadeOut();
        habilitarBotones();
    }
}

// -------------------------------------- //

function scrollFinal (){
    let tabla = $('#activos__lista');

    $(document).scroll(()=>{
        $(tabla).hover(()=>{
            deshabilitarScrollify();
            scrollTabla()
            deshabilitarScroll();
        }, ()=>{
            habilitarScroll()
            habilitarScrollify();
        })
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

function scrollCompras (){
    let compras = obtenerStorage('listaCompras')
    let tabla = $('#cartera__lista');

    if(compras){
        if(compras.length > 6){
            $(tabla).hover(()=>{
                deshabilitarScrollify();
                scrollListaCompras()
                deshabilitarScrollCompras();
            }, ()=>{
                habilitarScroll()
                habilitarScrollify();
            })
        }
    }
}

function scrollListaCompras (){
    $.scrollify.instantMove('#cartera__lista')
}

function deshabilitarScrollCompras(){
    window.onscroll = () =>{
        window.scrollTo(0, 0)
    }
}

function habilitarScroll (){
    window.onscroll = null;
}

// ---------------------------------------------- //
// ----------MOSTRAR/OCULTAR BILLETERAS---------- //
// ---------------------------------------------- //

function mostrarBilletera(){
    let billeteraTotal = obtenerArrayDeBilleteras();
    let elemento = $('.billeteraUser__balance__billetera--cantidad')
    let posicion;
    getAjaxConvReferencia('ARS', billeteraPesos.billeteraTotal)

    for(let i=0; i<billeteraTotal.length; i++){
        posicion = billeteraTotal[i];
        if(posicion.billeteraTotal){
            let cantidad = grandesCantidades(posicion.billeteraTotal)
            modificarElemento(elemento[i], `${posicion.simbolo}${cantidad}`)
        } else{
            modificarElemento(elemento[i], `${posicion.simbolo}0,00`)
        }
    }
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
    getAjaxConvReferencia(selector, balanceTotal)
}

function convertirMonedaCriptoRef(cantidad, cripto){
    let criptoValor = cripto[0].current_price;
    criptoValor = parseFloat((cantidad / criptoValor)).toFixed(4);
    return criptoValor
}

function accionarOjo(){
    estado = obtenerStorage('mostrarBilletera')
    if(estado){
        localStorage.setItem('mostrarBilletera', 'false')
    } else{
        localStorage.setItem('mostrarBilletera', 'true')
    }
    mostrarOcultar();
    $('#ojo').click(mostrarOcultar)
}

function mostrarOcultar (){
    estado = obtenerStorage('mostrarBilletera')
    let selectorRegistro = $('#depositoRetiro__registro--divisas');

    let mensajeOculto = '**************';
    let ojo = $('#ojo');

    let billeteras = obtenerArrayDeBilleteras();
    let cantidades = textoCantidad(billeteras);

    if(estado){
        $(ojo).attr('class', 'fas fa-eye-slash');
        $(selectorRegistro).removeAttr('disabled', '')
        mostrarbilleteraSeleccionada();
        $('#pesos__cantidad').text(cantidades[0])
        $('#dolares__cantidad').text(cantidades[1])
        $('#euros__cantidad').text(cantidades[2])
        $('.cartera__lista__posesion').show();
        $('#cartera__lista__mensaje').show();
        $('#cartera__lista--oculto').hide()

        localStorage.setItem('mostrarBilletera', 'false')
    } else {
        $(ojo).attr('class', 'fas fa-eye');
        $(selectorRegistro).attr('disabled', '')
        $('.billeteraUser__balance__billetera--cantidad').text(mensajeOculto);
        $('.depositoRetiro__registro--btc').text(mensajeOculto);
        $('.cartera__lista__posesion').hide();
        $('#cartera__lista__mensaje').hide();
        $('#cartera__lista--oculto').show()
        
        localStorage.setItem('mostrarBilletera', 'true')
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
    $('#depositoRetiro__retirar').click(()=>{
        mostrarBilletera();
        retirar();
    })
}

function accionarDepositoEnter(){
    input = $('#depositoRetiro__ingreso--cantidad').keydown((event)=>{
        if(event.which == 13){
            event.preventDefault();
            depositar();
            mostrarBilletera()
        }
    })
}

// ---------------------------------------------- //
// -------------ARMADO DE LISTAS----------------- //
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
    
    let valorCambio = $('.activo__cuerpo--cambio')
    valorCambio = valorCambio[i]
    let textoCambio = valorCambio.innerHTML;
    let valorTextoCambio = textoCambio.indexOf('-')

    if(valorTextoCambio == -1){
        $(valorCambio).css('color', '#14b10b')
    }

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
    let parElegido = $(par[i]).text();
    parElegido = parElegido.toLowerCase();
    parElegido = parElegido.split('/');
    parElegido = JSON.stringify(parElegido)
    sessionStorage.setItem('cripto', parElegido);
}

function valorSelectorInicial(){
    let moneda = obtenerSessionStorage('cripto');
    if(moneda){
        let monedaInicial = moneda[1];  
        $('#activos__cabecera--divisas').val(monedaInicial)
        getAjaxMercado(monedaInicial)
    }else{
        getAjaxMercado('ars')
    }
}

// ---------------------------------------------- //
// ---------ARMADO DE LISTA DE COMPRAS----------- //
// ---------------------------------------------- //

function cambioConversionCompras(){
    let arrayCompras = obtenerStorage('listaCompras');
    $('#cartera__lista__cabecera--divisas').change(()=>{
        if(arrayCompras.length > 0){
            let moneda = $('#cartera__lista__cabecera--divisas').val();
            getAjaxModificarCompras(moneda, arrayCompras)
        }
    })
}

function armadoDeCabecera(){
    crearDivIdPadre('#cartera__lista', 'id', 'cartera__lista__cabecera');
    crearElemento('#cartera__lista__cabecera', 'p', 'id', 'cartera__lista__cabecera--nombre', 'Nombre', 0);
    crearElemento('#cartera__lista__cabecera', 'p', 'id', 'cartera__lista__cabecera--cantidad', 'Cantidad', 0);
    crearElemento('#cartera__lista__cabecera', 'p', 'id', 'cartera__lista__cabecera--valor', 'Valor', 0);
    crearElemento('#cartera__lista__cabecera', 'p', 'id', 'cartera__lista__cabecera--cambio', '24 Cambio', 0);
    crearElemento('#cartera__lista__cabecera', 'p', 'id', 'cartera__lista__cabecera--ganancia', 'Gan./Perd.', 0);

    crearSelector('#cartera__lista__cabecera', 'select', 'id', 'cartera__lista__cabecera--divisas', 0);
    crearElemento('#cartera__lista__cabecera--divisas', 'option', 'value', 'ars', 'ARS', 0)
    crearElemento('#cartera__lista__cabecera--divisas', 'option', 'value', 'usd', 'USD', 0)
    crearElemento('#cartera__lista__cabecera--divisas', 'option', 'value', 'eur', 'EUR', 0)

    cambioConversionCompras();
}

function armadoListaCompras(compra, info, balances){
    let selector = $('#cartera__lista__cabecera--divisas').val();
    let billetera = elegirBilletera(selector);
    selector = selector.toUpperCase();

    for(i=0; i<compra.length; i++){
        let cantidad;
        let imagen = info[i].image;
        let nombre = info[i].name;
        window.outerWidth > 500 ? cantidad = compra[i].cantidad : cantidad = medianasCantidades(compra[i].cantidad);
        let tk = compra[i].tipo;
        let conversion = conversionEntreCantidades(compra[i], selector)
        let cambio = porcentajeDeCambio(info[i].price_change_percentage_24h);



        let balanceConvertido = conversionBalance(compra[i], selector);




        let balanceEstilizado = estilosBalance(billetera.simbolo, balances[i])



        let nombreUsar = window.outerWidth > 940 ? nombre : tk
        conversion += balances[i];
        conversion = parseFloat(conversion.toFixed(2))
        conversion = grandesCantidades(conversion)

        crearDivIdPadre('#cartera__lista', 'class', 'cartera__lista__posesion');
        crearDivClassPadre('.cartera__lista__posesion', 'class', 'nombre', i);
        crearImagen('.nombre', imagen, 'class', 'cartera__lista__posesion--image', i);
        crearElemento('.nombre', 'p', 'class', 'cartera__lista__posesion--nombre', nombreUsar, i);
        crearElemento('.cartera__lista__posesion', 'p', 'class', 'cartera__lista__posesion--cantidad', `${cantidad} ${tk}`, i);
        crearElemento('.cartera__lista__posesion', 'p', 'class', 'cartera__lista__posesion--conversion', `${billetera.simbolo}${conversion}`, i);
        crearElemento('.cartera__lista__posesion', 'p', 'class', 'cartera__lista__posesion--cambio', cambio, i)
        crearElemento('.cartera__lista__posesion', 'p', 'class', 'cartera__lista__posesion--ganancias', balanceEstilizado , i)
        crearBtn('.cartera__lista__posesion', 'class', 'cartera__lista__posesion--operar',i)

        let valorCambio = $('.cartera__lista__posesion--cambio')
        valorCambio = valorCambio[i]
        let textoCambio = valorCambio.innerHTML;
        let valorTextoCambio = textoCambio.indexOf('-')

        if(valorTextoCambio == -1){
            $(valorCambio).css('color', '#14b10b')
        }

        let valorBalance = $('.cartera__lista__posesion--ganancias')
        valorBalance = valorBalance[i]
        let textoBalance = valorBalance.innerHTML;
        let valorTextoBalance = textoBalance.indexOf('+')
        let valorNeutro = textoBalance.indexOf('$')
        
        if(!valorTextoBalance|| !valorNeutro){
            $(valorBalance).css('color', '#14b10b')
        }

        accionarBtnActivos();
    }
}

function accionarBtnActivos(){
    let arrayCompras = obtenerStorage('listaCompras')
    for(let i=0; i<arrayCompras.length; i++){
        let btn = $('.cartera__lista__posesion--operar')
        $(btn[i]).click(()=>{
            btnActivos(i, arrayCompras[i])
        })
    }
}

function btnActivos(i, objetoCripto){
    let selector = $('#cartera__lista__cabecera--divisas').val()
    let tk = objetoCripto.tipo.toLowerCase();

    let par = [tk, selector]
    parElegido = JSON.stringify(par)
    sessionStorage.setItem('cripto', parElegido);
}

function estilosBalance(simbolo, balance){
    if (balance > 0){
        balance = medianasCantidades(balance);
        return `+${simbolo}${balance}`

    } else if(balance == 0){
        return `${simbolo}0,00`

    } else{
        balance = Math.abs(balance)
        return `-${simbolo}${balance}`
    }
}

function conversionBalance (balance, moneda){
    let preciosMonedas = obtenerStorage('divisas');
    let monedaSelector = preciosMonedas.find(divisa => divisa.ticker === moneda);
    let monedaCompra = preciosMonedas.find(divisa => divisa.ticker === balance.moneda);
    
    return monedaSelector * monedaCompra;
}