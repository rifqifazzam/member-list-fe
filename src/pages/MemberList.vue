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
          <v-form>
            <v-text-field v-model="form.first_name" label="First Name" required></v-text-field>
            <v-text-field v-model="form.last_name" label="Last Name" required></v-text-field>
            <v-text-field v-model="form.email" label="Email" required></v-text-field>
            <v-text-field v-model="form.phone_number" label="Phone Number"></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="saveMember">Save</v-btn>
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

const headers = [
  { text: 'First Name', value: 'first_name' },
  { text: 'Last Name', value: 'last_name' },
  { text: 'Email', value: 'email' },
  { text: 'Phone Number', value: 'phone_number' },
  { text: 'Actions', value: 'actions', sortable: false },
];

// Fetch all members from the API
function getMembers() {
  MemberService.getAll().then((response) => {
    members.value = response.data;
    console.log(response.data);
  });

}

function getMembers2() {
  MemberService.getAll()
    .then((response) => {
      console.log(response.data);  // Check if the data is coming here
      members.value = response.data;
    })
    .catch((error) => {
      console.error('Error fetching members:', error);
    });
}


// Open the form to add a new member
function openDialog() {
  form.value = { first_name: '', last_name: '', email: '', phone_number: '' };
  dialog.value = true;
  editing.value = false;
}

// Edit an existing member
function editMember(member) {
  form.value = { ...member };
  dialog.value = true;
  editing.value = true;
}

// Save a member (either creating or updating)
function saveMember() {
  if (editing.value) {
    MemberService.update(form.value.id, form.value).then(() => {
      getMembers();
      dialog.value = false;
    });
  } else {
    MemberService.create(form.value).then(() => {
      getMembers();
      dialog.value = false;
    });
  }
}

// Delete a member
function deleteMember(id) {
  MemberService.delete(id).then(() => {
    getMembers();
  });
}

// Load members when the component is mounted
onMounted(() => {
  getMembers();
  getMembers2();
  console.log("onMounted is called");
  console.log(members.value); 
});
</script>
