var AIIncidentAssistant = Class.create();
AIIncidentAssistant.prototype = {
    initialize: function() {},

    summarizeIncident: function (incidentSysId) {
        var gr = new GlideRecord('incident');
        if (!gr.get(incidentSysId)) {
            return 'Incident not found';
        }

        var shortDesc = gr.getValue('short_description') || '';
        var description = gr.getValue('description') || '';
        var workNotes = gr.getValue('work_notes') || '';

        var prompt = 'Summarize the following IT incident in 3-4 concise sentences ' +
                     'for a service desk agent. Include the core problem, current status, ' +
                     'and any next steps mentioned.\n\n' +
                     'Short Description: ' + shortDesc + '\n' +
                     'Description: ' + description + '\n' +
                     'Work Notes: ' + workNotes;

        var summary = this._callLLM(prompt);

        gr.setValue('u_ai_summary', summary);
        gr.update();

        return summary;
    },

    _callLLM: function (promptText) {
        try {
            var request = new sn_ws.RESTMessageV2();
            request.setHttpMethod('POST');
            request.setEndpoint('https://api.openai.com/v1/chat/completions');

            var apiKey = gs.getProperty('openai.api.key');
            request.setRequestHeader('Authorization', 'Bearer ' + apiKey);
            request.setRequestHeader('Content-Type', 'application/json');

            var body = {
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: 'You are a helpful IT service desk assistant.' },
                    { role: 'user', content: promptText }
                ],
                max_tokens: 200,
                temperature: 0.3
            };
            request.setRequestBody(JSON.stringify(body));

            var response = request.execute();
            var responseBody = JSON.parse(response.getBody());

            if (responseBody.choices && responseBody.choices.length > 0) {
                return responseBody.choices[0].message.content.trim();
            }
            return 'AI summary unavailable: ' + JSON.stringify(responseBody);

        } catch (ex) {
            gs.error('AIIncidentAssistant error: ' + ex.message);
            return 'Error generating summary: ' + ex.message;
        }
    },

    type: 'AIIncidentAssistant'
};
