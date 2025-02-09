import QueryService from '../query.service';

export default new class salidaService extends QueryService{
  constructor() {
    super(`/exit`, 'exit');
  }
};