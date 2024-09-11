import axios from 'axios';

// Define the base URL for your API
const API_URL = 'http://localhost:8000/api/members/';

class MemberService {
  // Fetch all members from the API
  getAll() {
    return axios.get(API_URL);
  }

  // Get a specific member by ID
  get(id) {
    return axios.get(`${API_URL}${id}/`);
  }

  // Create a new member
  create(data) {
    return axios.post(API_URL, data);
  }

  // Update a member by ID
  update(id, data) {
    return axios.put(`${API_URL}${id}/`, data);
  }

  // Delete a member by ID
  delete(id) {
    return axios.delete(`${API_URL}${id}/`);
  }
}

export default new MemberService();
