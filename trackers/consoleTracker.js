const EventEmitter = require('events');

module.exports = class ConsoleTracker extends EventEmitter {
    constructor(){
        super();
        this.eventType="console";
        this.events=[this.eventType];
    }

    async instrument(page) {
        page.on(`console`, message => setTimeout((data)=>{this.report(data)}, 50, message));

    }

    report(consoleMessage) {

        const eventData = {
            eventType: this.eventType,
            eventData: {
            messageType: consoleMessage.type(),
            messageText: consoleMessage.text()
            }
        }        
        this.emit(this.eventType,JSON.stringify(eventData));
    }

}