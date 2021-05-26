const TicketControl = require("../models/ticket-control");

const ticketControl = new TicketControl();


const socketController = (socket) => {

    socket.emit('ultimo-ticket', ticketControl.ultimo);
    socket.emit('estado-actual', ticketControl.ultimos4);
    socket.emit('ticket-pendientes', ticketControl.tickets.length);

    console.log('Cliente conectado', socket.id );

    socket.on('disconnect', () => {
        console.log('Cliente desconectado', socket.id );
    });

    socket.on('siguiente-ticket', ( payload, callback ) => {
        
        const siguiente = ticketControl.siguiente();
        callback(siguiente);
        socket.broadcast.emit('ticket-pendientes', ticketControl.tickets.length);

        // notificar nuevo ticket pendiente
    })

    socket.on('atender-ticket', ({escritorio}, callback) => {
        if(!escritorio){
            return callback({
                ok:false,
                msg: 'El escritorio es obligatorio'
            })
        }

        //TODO: Notificar cambio en los ultimos4
        const ticket = ticketControl.atenderTicket(escritorio);
        socket.broadcast.emit('estado-actual', ticketControl.ultimos4);

        //Notificar cambio En cola
        socket.emit('ticket-pendientes', ticketControl.tickets.length);
        socket.broadcast.emit('ticket-pendientes', ticketControl.tickets.length);

        if(!ticket){
            callback({
                ok:false,
                msg: 'Ya no hay ticket pendientes'
            });
        } else {
            callback({
                ok:true,
                ticket
            })
        }

    })

}



module.exports = {
    socketController
}

