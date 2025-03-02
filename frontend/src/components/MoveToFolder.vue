<template>
    <div v-if="showMoveModal" class="modal-overlay" @click="closeModal">
      <div class="modal" @click.stop>
        <h2>Select a Folder to Move</h2>
  
        <!-- Display Available Folders in that Page -->
        <ul>
          <li 
            v-for="folder in availableFolders" 
            :key="folder.id" 
            @click="moveToFolder(folder.id)"
          >
            {{ folder.name }}
          </li>
        </ul>
  
        <div class="modal-actions">
          <button @click="closeModal" class="modal-button cancel">Cancel</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { defineProps, defineEmits } from 'vue';
  
  const props = defineProps({
    showMoveModal: {
      type: Boolean,
      required: true,
    },
    selectedItem: {
      type: Object,
      required: true,
    },
    availableFolders: {
      type: Array,
      required: true,
    },
  });
  
  const emit = defineEmits(['update:showMoveModal', 'move-item']);
  
  const closeModal = () => {
    emit('update:showMoveModal', false);
  };
  
  const moveToFolder = (destinationFolderId) => {
    console.log('Folder selected for move:', destinationFolderId);
    emit('move-item', destinationFolderId);
    closeModal();
  };
  
  console.log('Available Folders in Modal:', props.availableFolders);
  </script>
  
  
  <style scoped>
 
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .modal {
    background: white;
    padding: 20px;
    width: 500px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  ul {
    list-style-type: none;
    padding: 10px;
    margin-bottom: 20px;
  }
  
  li {
    padding: 10px;
    cursor: pointer;
    border-bottom: 1px solid #ddd;
  }
  
  li:hover {
    background-color: #f0f0f0;
  }
  
  .modal-actions {
    display: flex;
    justify-content: flex-end;
  }
  
  .modal-button {
    padding: 8px 16px;
    margin: 0 5px;
    cursor: pointer;
  }
  
  .cancel {
    background-color: #a94442;
    color: white;
    border: none;
  }
  
  .cancel:hover {
    background-color: #883736;
  }
  
  
  </style>
  