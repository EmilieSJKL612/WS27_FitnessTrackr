
import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import useMutation from "../api/useMutation";
import useQuery from "../api/useQuery";


export default function ActivitiesPage() {
  
  //RQ3
  const { token } = useAuth();

  //RQ1, 2
  const { data: activities, loading, error } = useQuery("/activities", "activities");


  //RQ7
  const { 
    mutate: deleteActivity, 
    loading: deleteLoading, 
    error: deleteError 
  } = useMutation("DELETE", "/activities", ["activities"]);


  //RQ11
  const {
    mutate: createActivity,
    error: createError,
    loading: createLoading,
  } = useMutation("POST", "/activities", ["activities"]);


  const [formData, setFormData] = useState({
    name: "",
    description: ""
  });


  const [activityError, setActivityError] = useState({});


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "name") {
      setFormData({
        name: value,
        description: formData.description
      });
    } else if (name === "description") {
      setFormData({
        name: formData.name,
        description: value
      });
    }
  };


  //RQ9
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.description.trim()) {
      return; 
    }
    
    try {
      await createActivity(formData);
      setFormData({
        name: "",
        description: ""
      });
    } 
    catch (e) {
      console.error("Failed to create activity:", e);
    }
  };


  //RQ6
  const handleDelete = async (activityId) => {
    try {
      setActivityError({ ...activityError, [activityId]: null });      
      await deleteActivity({}, `/${activityId}`);
    } 
    catch (e) {
      setActivityError({ ...activityError, [activityId]: e.message });
      console.error("Failed to delete activity:", e);
    }
  };


  if (loading) return <p>Loading activities...</p>;
  if (error) return <p>Error loading activities: {error}</p>;


/*
  const [deleteMessage, setDeleteMessage] = useState("");

  const handleDelete = async (id) => {
    try {
      await deleteActivity(null, `/activities/${id}`);
      setDeleteMessage("");
    }
    catch (e) {
      setDeleteMessage(e.message);
    }

  }

  const handleAdd = async (formData) => {
    const name = formData.get("name");
    const description = formData.get("description");
    await addActivity({ name, description });
  };
*/



  return (
    <>
      <h1>Activities</h1>
      <p>Imagine all the activities!</p>

      {/* RQ8 */}
      {token && (
        <section>
          <h2>Add New Activity</h2>
          <form onSubmit={handleSubmit}>
            <label>
              Activity Name
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              Description
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </label>
            <button type="submit" disabled={createLoading}>
              {createLoading ? "Creating..." : "Add Activity"}
            </button>

            {/* RQ10 */}
            {createError && <output style={{color: 'red'}}>Error: {createError}</output>}
          </form>
        </section>
      )}

      <section>
        <h2>All Activities</h2>
        
        {activities && activities.length > 0 ? (
          <ul>
            {activities.map((activity) => (
              <li key={activity.id} style={{ 
                marginBottom: '1rem', 
                padding: '1rem', 
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}>
                <h3>{activity.name}</h3>
                <p>{activity.description}</p>
                
                {/* RQ4: delete button - only shown if user is logged in */}
                {token && (
                  <>
                    <button onClick={() => handleDelete(activity.id)}>
                      Delete
                    </button>

                    {/* RQ5: error message for when not authorized to delete */}
                    {activityError[activity.id] && (
                      <output style={{color: 'red', display: 'block', marginTop: '0.5rem'}}>
                        Error: {activityError[activity.id]}
                      </output>
                    )}
                  </>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No activities found.</p>
        )}
      </section>
    </>
  );
}
