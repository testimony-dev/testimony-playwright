const EventEmitter = require('events');

module.exports = class ClickTracker extends EventEmitter {
    constructor(){
        super();
        this.eventType="click"
        this.events=[this.eventType];
    }


    async instrument(page) {
        
        await page.exposeBinding('clicked', async (source, elementData) => {
            setTimeout((data)=>{this.report(data)}, 50, elementData);
            
          });

        await page.addInitScript({ content: `
        document.addEventListener('click', event => window.clicked(
            {
                classList: [...event.target.classList],
                elementId: event.target.id,
                text: event.target.textContent,
                innerText: event.target.innerText, 
                innerHtml: event.target.innerHTML,
                outerText: event.target.outerText, 
                outerHtml: event.target.outerHTML, 
                timeStamp: event.timeStamp, 
                screenX: event.screenX, 
                screenY: event.screenY, 
                dataSet: event.target.dataset,
                attributes: Array.from(event.target.attributes).map(a => [a.name, a.value]).reduce((acc, attr) => {
                    acc[attr[0]] = attr[1]
                    return acc
                    }, {})
            })); `});

    }

    report(elementData) {
        const eventData = {
            eventType: this.eventType,
            eventData: elementData
        };
        this.emit(this.eventType, JSON.stringify(eventData));
    }

}
