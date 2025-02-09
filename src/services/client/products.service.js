import QueryService from '../query.service';

export default new class productsService extends QueryService{
  constructor() {
    super(`/products`, 'products');
  }
};