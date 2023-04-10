// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityHandler, MessageFactory } = require('botbuilder');

const { QnAMaker } = require('botbuilder-ai');
// const DentistScheduler = require('./dentistscheduler');
// const IntentRecognizer = require('./intentrecognizer');

class DentaBot extends ActivityHandler {
    constructor(configuration, qnaOptions) {
        // call the parent constructor
        super();
        if (!configuration) throw new Error('[QnaMakerBot]: Missing parameter. configuration is required');

        // create a QnAMaker connector
        this.QnAMaker = new QnAMaker(configuration.QnAConfiguration, qnaOptions);
        // create a DentistScheduler connector
        // this.dentistScheduler = new DentistScheduler(configuration.SchedulerConfiguration);

        // create a LUIS connector
        // this.intentRecognizer = new IntentRecognizer(configuration.LuisConfiguration);

        this.onMessage(async (context, next) => {
            // send user input to QnA Maker and collect the response in a variable
            // don't forget to use the 'await' keyword
            const qna = await this.QnAMaker.getAnswers(context);

            // send user input to IntentRecognizer and collect the response in a variable
            // don't forget 'await'
            // const luis = await this.intentRecognizer.executeLuisQuery(context);

            // if (luis.luisResult.prediction.topIntent === 'GetAvailability' &&
            //     luis.intents.GetAvailability.score > 0.6 &&
            //     luis.entities.$instance &&
            //     luis.entities.$instance.datetime &&
            //     luis.entities.$instance.datetime[0]
            // ) {
            //     const datetime = luis.entities.$instance.datetime[0].text;

            //     const getAvailableTime = 'I have a few spots for ' + datetime;
            //     console.log(getAvailableTime);

            //     await context.sendActivity(getAvailableTime);
            //     await next();
            //     return;
            // }

            // if (luis.luisResult.prediction.topIntent === 'ScheduleAppointment' &&
            //     luis.intents.ScheduleAppointment.score > 0.6 &&
            //     luis.entities.$instance &&
            //     luis.entities.$instance.datetime
            // ) {
            //     const datetime = luis.entities.$instance.datetime[0].text;
            //     const setupAppointment = await this.dentistScheduler.scheduleAppointment(datetime);
            //     console.log(setupAppointment);

            //     await context.sendActivity(setupAppointment);
            //     await next();
            //     return;
            // }

            // If an answer was received from QnA Maker, send the answer back to the user.
            if (qna[0]) {
                console.log(qna[0]);
                await context.sendActivity(`${ qna[0].answer }`);
            } else {
                await context.sendActivity('I\'m not sure' +
                    'I found an answer to your question');
            }

            await next();
        });

        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            // write a custom greeting
            const welcomeText = 'Hello and welcome to Dental Office Assistant!';
            for (let cnt = 0; cnt < membersAdded.length; ++cnt) {
                if (membersAdded[cnt].id !== context.activity.recipient.id) {
                    await context.sendActivity(MessageFactory.text(welcomeText, welcomeText));
                }
            }
            // by calling next() you ensure that the next BotHandler is run.
            await next();
        });
    }
}

module.exports.DentaBot = DentaBot;
