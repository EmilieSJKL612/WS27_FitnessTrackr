import { useState } from "react";
import { useApi } from "./ApiContext";

/**
 * Returns a function to mutate some data via the API, as well as some state
 * that tracks the response of that mutation request.
 */
export default function useMutation(method, resource, tagsToInvalidate) {
  const { request, invalidateTags } = useApi();

  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = async (body) => {
    setLoading(true);
    setError(null);
    try {
      const result = await request(resource, {
        method,
        body: JSON.stringify(body),
      });
      setData(result);
      invalidateTags(tagsToInvalidate);
    } catch (e) {
      console.error(e);
      //setError(e.message);
      
      //Em: API documentation from FS GH instruction page
      if (e.message.includes('401')) {
        setError('You are not authorized to perform this action');
      } else if (e.message.includes('403')) {
        setError('You do not have permission to delete this activity');
      } else {
        setError(e.message);
      }
      throw e;

    } finally {
      setLoading(false);
    }
  };

  return { mutate, data, loading, error };
}
