import QueryService from '../query.service';

export default new class materialsService extends QueryService{
  constructor() {
    super(`/materials`, 'materials');
  }
};