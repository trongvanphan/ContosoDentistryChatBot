class DentistScheduler {
    constructor(configuration) {
        this.getAvailability = async () => {
            const response = await fetch(configuration.SchedulerEndpoint + 'availability');
            const times = await response.json();
            console.log(times)
            let responseText = 'Current time slots available: ';
            times.map(time => {
                responseText += `${ time }, `;
            });
            return responseText;
        };

        this.scheduleAppointment = async (time, date) => {
            const response = await fetch(configuration.SchedulerEndpoint + 'schedule', { method: 'post', body: { time: time, date: date } });
            let responseText = 'An appointment is set ' + (date ? 'for ' + date : '') + (time ? ' at ' + time : '');
            return responseText;
        };
    }
}

module.exports = DentistScheduler;
