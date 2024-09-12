<!-- eslint-disable vue/valid-v-slot -->
<template>
  <v-container>
    <v-btn color="primary" @click="openDialog">Add Member</v-btn>

    <!-- Data Table to Display Members -->
    <v-data-table :headers="headers" :items="members" class="elevation-1">
      <template #item.actions="{ item }">
        <v-btn small color="primary" @click="editMember(item)">Edit</v-btn>
        <v-btn small color="error" @click="deleteMember(item.id)">Delete</v-btn>
      </template>
    </v-data-table>

    <!-- Dialog for Adding/Editing Members -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>{{ editing ? 'Edit Member' : 'Add Member' }}</v-card-title>
        <v-card-text>
          <v-form ref="formRef" v-model="valid">
            <v-text-field
              v-model="form.first_name"
              label="First Name"
              :rules="[rules.required]"
              required
            ></v-text-field>
            <v-text-field
              v-model="form.last_name"
              label="Last Name"
              :rules="[rules.required]"
              required
            ></v-text-field>
            <v-text-field
              v-model="form.email"
              label="Email"
              :rules="[rules.required, rules.email]"
              required
            ></v-text-field>
            <v-text-field
              v-model="form.phone_number"
              label="Phone Number"
              :rules="[rules.required, rules.phone_number]"
              required
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="validateForm">Save</v-btn>
          <v-btn @click="dialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import MemberService from '@/services/MemberService';

const members = ref([]);
const form = ref({ first_name: '', last_name: '', email: '', phone_number: '' });
const dialog = ref(false);
const editing = ref(false);
const valid = ref(false);
const formRef = ref(null);

const rules = {
  required: (value) => !!value || 'This field is required',
  email: (value) => /.+@.+\..+/.test(value) || 'E-mail must be valid',
  phone_number: (value) => /^\d{8 }$/.test(value) || 'Phone number must be 10 digits',
};

const headers = [
  { text: 'First Name', value: 'first_name' },
  { text: 'Last Name', value: 'last_name' },
  { text: 'Email', value: 'email' },
  { text: 'Phone Number', value: 'phone_number' },
  { text: 'Actions', value: 'actions', sortable: false },
];

// Fetch all members from the API
function getMembers() {
  MemberService.getAll()
    .then((response) => {
      if (response) {
        members.value = response.data;
      }
    })
    .catch((error) => {
      console.error('Error fetching members:', error);
    });
}

// Open the dialog to add a new member
function openDialog() {
  form.value = { first_name: '', last_name: '', email: '', phone_number: '' }; // Reset form
  editing.value = false; // Set editing to false for "Add Member"
  dialog.value = true; // Open the dialog
}

// Edit an existing member
function editMember(member) {
  form.value = { ...member }; // Populate the form with selected member data
  editing.value = true; // Set editing to true for "Edit Member"
  dialog.value = true; // Open the dialog
}

// Validate form and save the member if valid
function validateForm() {
  formRef.value.validate().then((success) => {
    if (success) {
      saveMember(); // Call saveMember if form is valid
    }
  });
}

// Save a member (either creating or updating)
function saveMember() {
  if (editing.value) {
    MemberService.update(form.value.id, form.value)
      .then(() => {
        getMembers();
        dialog.value = false;
      })
      .catch((error) => {
        console.error('Error updating member:', error);
      });
  } else {
    MemberService.create(form.value)
      .then(() => {
        getMembers();
        dialog.value = false;
      })
      .catch((error) => {
        console.error('Error creating member:', error);
      });
  }
}

// Delete a member
function deleteMember(id) {
  MemberService.delete(id)
    .then(() => {
      getMembers();
    })
    .catch((error) => {
      console.error('Error deleting member:', error);
    });
}

// Load members when the component is mounted
onMounted(() => {
  getMembers();
});
</script>
