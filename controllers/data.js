const url = `http://localhost:3000/`;
const headers = { "Content-Type": "application/json" }

export default class Data {

    constructor(entity) {
        this.URL = `${url}${entity}`;
    }

    getData() {
        return this.fetchRequests("GET");
    }

    postData(data) {
        return this.fetchRequests("POST", data);
    }

    putData(data) {
        return this.fetchRequests("PUT", data);
    }

    deleteData() {
        return this.fetchRequests("DELETE");
    }

    fetchRequests(method, data = null) {
        const body = JSON.stringify(data);
        if(data) {
            return fetch(this.URL, { method, headers, body }).then(res => res.json() ).catch(err => console.log(err));
        }else{
            return fetch(this.URL, { method }).then(res => res.json() ).catch(err => console.log(err));
        }
    }

}