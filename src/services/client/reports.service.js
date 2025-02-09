import QueryService from '../query.service';

export default new class reportService extends QueryService{
  constructor() {
    super(`/reporte-dia`, 'reporte-dia');
  }
};