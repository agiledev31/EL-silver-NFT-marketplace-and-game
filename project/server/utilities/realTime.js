

const emitEvent = (event,sentTo,data= {}) => {
    lolSocket.emit(event+sentTo, data);
};

module.exports = { 
    emitEvent
};
