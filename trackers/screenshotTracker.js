const EventEmitter = require('events');

module.exports = class ScreenshotTracker extends EventEmitter {
    constructor(){
        super();
        this.eventType="screenshot";
        this.events=[this.eventType];
    }

    async instrument(page) {
        
        await page.exposeBinding('screenshotPage', async (source, element) => {
            
            const screenshotBuffer= await page.screenshot();
            const bufferString= screenshotBuffer.toString("base64");

            setTimeout((data)=>{this.report(data)}, 50, bufferString)
           
          }, { handle: true });

        await page.addInitScript({ content: ` document.addEventListener('click', event => window.screenshotPage(event.target)); `});

    }

    report(elementData) {

        const eventData = {
            eventType: this.eventType,
            eventData: elementData
        };
        this.emit(this.eventType,JSON.stringify(eventData))
    }

}
