/* eslint-disable no-unused-vars */
import axios from 'axios';

// Define the base URL for your API
const API_URL = 'http://localhost:8000/api/members/';
const TOKEN_VALIDATION_URL = 'http://localhost:8000/api/validate-token/';

class MemberService {
  // Get token from local storage
  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Token ${token}`,
      },
    };
  }

  // Validate token before making any API request
  validateToken() {
    return axios.get(TOKEN_VALIDATION_URL, this.getAuthHeaders())
      .then((response) => {
        return true;  // Token is valid
      })
      .catch((error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          localStorage.removeItem('token');  // Remove invalid token
          window.location.href = '/login';   // Redirect to login
        }
        return false;  // Token is invalid
      });
  }

  // Fetch all members from the API (GET /members/)
  getAll() {
    return this.validateToken().then((isValid) => {
      if (isValid) {
        return axios.get(API_URL, this.getAuthHeaders());
      }
    });
  }

  // Get a specific member by ID (GET /members/{id}/)
  get(id) {
    return this.validateToken().then((isValid) => {
      if (isValid) {
        return axios.get(`${API_URL}${id}/`, this.getAuthHeaders());
      }
    });
  }

  // Create a new member (POST /members/create/)
  create(data) {
    return this.validateToken().then((isValid) => {
      if (isValid) {
        return axios.post(`${API_URL}create/`, data, this.getAuthHeaders());
      }
    });
  }

  // Update a member by ID (PUT /members/{id}/update/)
  update(id, data) {
    return this.validateToken().then((isValid) => {
      if (isValid) {
        return axios.put(`${API_URL}${id}/update/`, data, this.getAuthHeaders());
      }
    });
  }

  // Delete a member by ID (DELETE /members/{id}/delete/)
  delete(id) {
    return this.validateToken().then((isValid) => {
      if (isValid) {
        return axios.delete(`${API_URL}${id}/delete/`, this.getAuthHeaders());
      }
    });
  }
}

export default new MemberService();
