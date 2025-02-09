import ApiClient from './api';

class ApiService {
  constructor(resource) {
    this.resource = resource;
    this.service = ApiClient;
  }

  getAll(params) {
    if (params) {
      return this.service.get(`${this.resource}`, { params });
    }
    return this.service.get(`${this.resource}`);
  }

  getResource(id, params) {
    if (params) {
      return this.service.get(`${this.resource}/${id}`, { params });
    }
    return this.service.get(`${this.resource}/${id}`);
  }
  create(payload){
    return this.service.post(`${this.resource}`, payload);
  }

  update(id, payload){
    return this.service.put(`${this.resource}/${id}`, payload);
  }

  remove(id) {
    return this.service.delete(`${this.resource}/${id}`);
  }


}

export default ApiService;

