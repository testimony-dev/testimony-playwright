const fs= require("fs");
const winston = require('winston');
const { combine, timestamp, label, printf } = winston.format;

module.exports = class MarkdownReporter {
    constructor({sessionTitle }){
        this.sessionTitle=sessionTitle;

        const logFormat = printf(({ level, message, label, timestamp }) => {
        return `${message} \r\n`;
        });
        
        this.logger = new winston.createLogger({
        transports: [
            new winston.transports.File({
                filename: `${this.sessionTitle}/sessionReport.md`,
                level:'info'
            })
        ],
        format: logFormat
        })
        this.initializeSession();

    }

    initializeSession(){
        const sessionDirectory=`./${this.sessionTitle}`;
        const dataDirectory=`./${this.sessionTitle}/sessionData`;
        if (!fs.existsSync(sessionDirectory)){
            fs.mkdirSync(sessionDirectory);
        }
        if (!fs.existsSync(dataDirectory)){
            fs.mkdirSync(dataDirectory);
        }
        this.logger.info(`# ${this.sessionTitle}`)
    }



    screenshot(event){
        const imageName= `click-${new Date().toISOString()}.png`;
        this.logger.info(`![${imageName}](./sessionData/${imageName})`);
        this.storeImage(`./${this.sessionTitle}/sessionData/${imageName}`, event.eventData);

    }

    console(event){
        this.logger.info(`   - *Console*: ${event.eventData.messageType} - ${event.eventData.messageText} `)

    }

    click(event){
        this.logger.info(`### Clicked ${event.eventData.text}`);

    }



    storeImage(imgName, base64Data){
        fs.promises.writeFile(imgName, base64Data, {encoding: 'base64'}, function(err) {
            this.logger.info(err);
        });
    }

}
