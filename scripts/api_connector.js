const api_key = 'eevpD404SnZGUsBdm7CqyCfEHkV9GLn7RGON9Ydn';
const ct = require('countries-and-timezones');
// import fetch from 'node-fetch';
const fetch = require('node-fetch');
class ApiConnector {
    "Api conection and fetching data"

    constructor() { }
    getCountry(use_region, code) {
        let country = '';
        if (use_region === "yes") {
            //getting "location" of client
            let zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            country = ct.getCountryForTimezone(zone).id; //id of the country according to zone
        }
        else {
            country = code;
        }
        return country;
    }
    async getIdTitle(title) {
        "this method returns id and poster"
        let url = `https://api.watchmode.com/v1/autocomplete-search/?apiKey=${api_key}&search_field=name&search_value=${title}&search_type=1`;
        let id = 0;
        let poster = '';
        let data = [];
        let json_data;
        try {

            const response = await fetch(url, { method: 'Get' });

            json_data = await response.json();
            if (json_data.results.length > 0) {
                id = JSON.parse(json_data["results"][0].id);
                poster = json_data["results"][0].image_url;
                data.push(id);
                data.push(poster);
                return data;
            }
            else{
                return false;
            }

        } catch (error) {
            throw new Error('Título no encontrado: ' + error.message);
        }
    }

    async getPlatforms(id, country) {
        let url = `https://api.watchmode.com/v1/title/${id}/sources/?apiKey=${api_key}&regions?=${country}`;
        let json_data;
        try {
            const response_platform = await fetch(url, { method: 'Get' });
            json_data = await response_platform.json();
            return json_data;
        } catch (error) {
            console.log(error);
        }
    }

    async sendRequest(title, use_region, code) {
        let country = this.getCountry(use_region, code);
        let id_data = await this.getIdTitle(title);
        if (id_data) {
            let id = id_data[0]; //save id
            let poster = id_data[1]; //save poster url
            let platform = {};
            let keys = ['platform', 'web_url', 'poster'];
            let results = [];
            try {
    
                const res = await this.getPlatforms(id, country);
                for (let i = 0; i < res.length; i++) {
                    "platform will contain {platform: name, web_url: url}"
                    platform[keys[0]] = res[i].name;
                    platform[keys[1]] = res[i].web_url;
                    platform[keys[2]] = poster;
    
                    results.push(platform);
                }
                return results;
        }
        catch (error) {
            throw error;
        }
    }else{
        return false;
    }
    }
}

module.exports = ApiConnector;

