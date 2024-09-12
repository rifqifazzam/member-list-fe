<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <v-container class="d-flex align-center justify-center fill-height" style="height: 100vh;">
      <v-form @submit.prevent="login" class="text-center" style="max-width: 400px; width: 100%;">
        <v-text-field v-model="username" label="Username" required></v-text-field>
        <v-text-field v-model="password" label="Password" type="password" required></v-text-field>
        <v-btn type="submit" color="primary" block>Login</v-btn>
      </v-form>
      <v-alert v-if="errorMessage" type="error">{{ errorMessage }}</v-alert>
    </v-container>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import axios from 'axios';
  import router from '@/router';
  
  const username = ref('');
  const password = ref('');
  const errorMessage = ref('');
  
  function login() {
    axios.post('http://localhost:8000/api/login/', {
      username: username.value,
      password: password.value,
    })
    .then((response) => {
      // Save the token and expiration time to localStorage as provided by backend
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('expires_at', response.data.expires_at);  // Store as string
  
      // Redirect the user to the member list page after successful login
      router.push('/MemberList');
    })
    .catch(() => {
      errorMessage.value = 'Invalid credentials. Please try again.';
    });
  }

  
  </script>
