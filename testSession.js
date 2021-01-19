const Queue= require('better-queue');
const MarkdownReporter = require('./markdownReporter')

module.exports = class TestSession {
    constructor({sessionTitle}) {
        this.trackers={};
        this.reporter=new MarkdownReporter({sessionTitle});
    }


    track(tracker) {
        this.trackers[tracker.eventType]=tracker;
    }

    async start(browser, initialUrl){
         this.q = new Queue((event, cb)=>{
            this.reporter[event.eventType](event);
            cb(null,Date.now());
        });

        const context = await  browser.newContext({ viewport: null });
        const page =await context.newPage();
        await this.attachTrackers(page)
        await page.goto(initialUrl);
    }

    async attachTrackers(page){
        for (const trackerName in this.trackers) {
            const tracker = this.trackers[trackerName];
            await tracker.instrument(page);
            
            tracker.events.forEach(trackerEvent => {
                tracker.on(trackerEvent, (eventData)=>{
                    const eventObj= JSON.parse(eventData)
                    this.q.push(eventObj);
                })
            });
        }

    }

}


