<template>
  <div v-if="showCreateModal" class="modal-overlay" @click="closeModal">
    <div class="modal" @click.stop>
      <h2>Create New Folder</h2>
      <input 
        v-model="newFolderName" 
        type="text" 
        placeholder="Enter folder name"
        class="modal-input"
        @keyup.enter="createFolder"
      >

      <div class="modal-actions">
        <button @click="closeModal" class="modal-button cancel">Cancel</button>
        <button @click="createFolder" class="modal-button create">Create</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';

const newFolderName = ref('');

defineProps({
  showCreateModal: {
    type: Boolean,
    required: true,
  }
});

const emit = defineEmits(['update:showCreateModal', 'create-folder']);

// Close Create Modal
const closeModal = () => {
  emit('update:showCreateModal', false); 
  newFolderName.value = ''; 
};

// Create the folder
const createFolder = () => {
  if (newFolderName.value.trim()) {
    emit('create-folder', newFolderName.value.trim());
    closeModal();
  }
};
</script>

<style scoped>

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
}

.modal h2 {
  margin-bottom: 1rem;
  color: #333;
}

.modal-input {
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.modal-button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.modal-button.cancel {
  background-color: #f0f0f0;
}

.modal-button.create {
  background-color: #a94442;
  color: white;
}
</style>
