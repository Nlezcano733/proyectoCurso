let panelUsuario, monedaDeposito, botonOjo, compra;

// --------- CREACION DE CONSTRUCTORES ---------- //

function Billetera (divisa, divisaObjeto, billeteraTotal, cantidadDivisa, arrayCompras){
    this.divisa = divisa,
    this.divisaObjeto = divisaObjeto;
    this.billeteraTotal = parseFloat(billeteraTotal), // cantidad de dinero total
    this.cantidadDivisa = parseFloat(cantidadDivisa), // cantidad de plata que queda
    this.arrayCompras = arrayCompras
    // this.arrayCantidadCripto = arrayCantidadCripto
}

function BilleteraParcial (divisa, billeteraTotal){
    this.divisa = divisa;
    this.billeteraTotal = parseInt(billeteraTotal);
}

// ------------------------------------ //

function Divisas (nombre, ticker, value, simbolo){
    this. nombre = nombre,
    this.ticker = ticker,
    this.value = value,
    this.simbolo = simbolo
}

Divisas.prototype.conversion = function ({value}){
    return parseFloat((this.value / value).toFixed(4));
}

// --------------------------------------- //
let ars = new Divisas ('Pesos', 'ARS', 1, '$');
let usd = new Divisas ('Dolar', 'USD', 156, '$');
let euro = new Divisas ('Euro', 'EURO', 184, '€');

let carteraDivisas = [ars, usd, euro];
// --------------------------------------- //

function Compra(tipo, cantidad, monedaValor, monedaSimbolo, valor){
    this.tipo = tipo,
    this.cantidad = cantidad,
    this.monedaValor = monedaValor
    this.monedaSimbolo = monedaSimbolo,
    this.valor = valor
}