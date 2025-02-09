import { useQuery, useMutation } from "@tanstack/vue-query";
import ApiService from "./api.services";

class QueryService extends ApiService {
  constructor(resource, key) {
    super(resource);
    this.resource = resource;
    this.key = key;
  }

  useListQuery(
    params,
    options = {
      refetchOnWindowFocus: true, 
      refetchOnMount: true,     
      retryOnMount: false,      
      enabled: true,     
    }
  ) {
    return useQuery({
      queryKey: [`${this.key}_list`, params?.value],
      queryFn: async () => {
        return await this.getAll(params?.value)
          .then((res) => {
            return res.data;
          })
          .catch((err) => {
            throw err;
          });
      },
      ...options,
    });
  }

  useGetQuery(
    id,
    params,
    options = {
      refetchOnWindowFocus: true,
      refetchOnMount: true, 
      retryOnMount: false,
      enabled: true,
    }
  ) {
    return useQuery({
      queryKey: [`${this.key}_get`, id],
      queryFn: () => {
        return this.getResource(id.value, params?.value);
      },
      ...options,
    });
  }

  useCreateMutation() {
    return useMutation({
      mutationKey: [`${this.key}_create`],
      mutationFn: async (payload) => {
        return await this.create(payload)
          .then((res) => {
            return res.data;
          })
          .catch((err) => {
            throw new Error(err.response?.data?.message ?? "An error occurred");
          });
      },
    });
  }

  useUpdateMutation(id) {
    return useMutation({
      mutationKey: [`${this.key}_update`, id],
      mutationFn: async (payload) => {
        return await this.update(id.value, payload)
          .then((res) => {
            return res.data;
          })
          .catch((err) => {
            throw new Error(err.response?.data?.message ?? "An error occurred");
          });
      },
    });
  }

  useRemoveMutation() {
    return useMutation({
      mutationKey: [`${this.key}_remove`],
      mutationFn: async (id) => {
        return await this.remove(id)
          .then((res) => {
            return res.data;
          })
          .catch((err) => {
            throw err;
          });
      },
    });
  }
}

export default QueryService;
