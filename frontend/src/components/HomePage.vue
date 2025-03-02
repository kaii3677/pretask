<template>
  <div class="home-container">
    <!-- Navigation Bar -->
    <nav class="nav-bar">
      <div class="nav-left">
        <button class="home-button">
          <Folder class="folder-icon" />
          Home
        </button>
      </div>
      <div class="nav-right">
        <!-- Create Button to show Create Modal -->
        <button class="action-button create-button" @click="showCreateModal = true">
          <Plus class="button-icon" />
          Create
        </button>

        <!-- Upload Button with File Input -->
        <button class="action-button upload-button" @click="triggerFileInput">
          <Upload class="button-icon" />
          Upload
        </button>
        <input
          type="file"
          ref="fileInput"
          @change="handleFileUpload"
          style="display: none"
        />
      </div>
    </nav>

    <!-- Main Content -->
    <main class="main-content">
      <!-- My Folders Section -->
      <section class="section">
        <div class="section-header">
          <h2 class="section-title">My Folders</h2>
          <button class="sort-button">
            Sort by: Name
          </button>
        </div>
        <div class="folders-files-container">
          <div class="folders-grid">
            <div
              v-for="(item, index) in sortedFolders"
              :key="index"
              class="folder-item"
              :class="{ selected: selectedItem?.id === item.id }"
              @click="selectItem(item)"  
              @dblclick="openItem(item)"
            >
            <component
              :is="item.type === 'folder' ? Folder : FileText"
              class="folder-icon"
            />
            <span>{{ item.name }}</span>
          </div>
          </div>
        </div>
      </section>

      <!-- My Files Section -->
        <section class="section">
          <h2 class="section-title">My Files</h2>
          <div class="folders-files-container">
            <div class="files-grid">
              <div
                v-for="(item, index) in sortedFiles"
                :key="index"
                class="file-item"
                :class="{ selected: selectedItem?.name === item.name }"
                @click="selectItem(item)"
                @dblclick="openItem(item)"
              >
                <FileText class="file-icon" />
                <span>{{ item.name }}</span>
              </div>
            </div>
          </div>
        </section>

      <!-- Action Buttons -->
      <div class="action-buttons" v-if="selectedItem">

        <!-- Move Button -->
        <button class="icon-button" @click="showMoveModal = true">
          <FolderInput class="action-icon" />
          <span>Move</span>
        </button>

        <!-- Edit Button -->
        <button class="icon-button">
          <Edit class="action-icon" @click="showEditModal = true"/>
        </button>

        <!-- Delete Button -->
        <button
          class="icon-button"
          @click="handleDelete(selectedItem)"
        >
          <Trash class="action-icon" />
        </button>


      </div>
    </main>

    <CreateFolder
      :showCreateModal="showCreateModal" 
      @update:showCreateModal="showCreateModal = $event"
      @create-folder="handleCreateFolder"
    />

    <EditName
      :showEditModal="showEditModal" 
      @update:showEditModal="showEditModal = $event"
      @edit-name="handleEditName"
      :currentName="selectedItem?.name"
      :type="selectedItem?.type"  
    />

    <MoveToFolder 
      v-if="showMoveModal"
      :showMoveModal="showMoveModal"
      :selectedItem="selectedItem"
      :availableFolders="availableFolders"
      @update:showMoveModal="showMoveModal = $event"
      @move-item="handleMove"
    />

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Folder, Plus, Upload, FileText, FolderInput, Edit, Trash } from 'lucide-vue-next';
import CreateFolder from './CreateFolder.vue';
import EditName from './EditBox.vue';
import MoveToFolder from './MoveToFolder.vue';
import { fetchFiles, fetchFolders, uploadFile, createFolder, deleteItem, editName, moveItem} from './Actions';
import { useRouter } from 'vue-router';

const router = useRouter();

const selectedItem = ref(null);
const fileInput = ref(null);
const files = ref([]);
const folders = ref([]);
const showCreateModal = ref(false);
const showEditModal = ref(false);
const newName = ref('');
const showMoveModal = ref(false);

// Sort by Name
const sortedFolders = computed(() => folders.value.slice().sort((a, b) => a.name.localeCompare(b.name)));
const sortedFiles = computed(() => files.value.slice().sort((a, b) => a.name.localeCompare(b.name)));
const availableFolders = computed(() => {
  if (!selectedItem.value) return [];
  return folders.value.filter(folder => folder.id !== selectedItem.value?.id);
});


// Fetch files and folders 
const loadData = async () => {
  try {
    files.value = await fetchFiles(null); 
    folders.value = await fetchFolders(null); 
  } catch (error) {
    console.error('Error loading data:', error);
  }
};

onMounted(() => {
  loadData();
});

// Open file or folder
const openItem = (item) => {
  if (item.type === 'file') {
    window.open(`http://localhost:5000/api/files/open/${item.name}`, '_blank');
  } else if (item.type === 'folder') {
    router.push({ name: 'openFolder', params: { folderId: item.id } });
  }
};

// Select an Item
const selectItem = (item) => {
  selectedItem.value = selectedItem.value?.id === item.id ? null : item;
  if (selectedItem.value) {
    newName.value = selectedItem.value.name;
  }
};

const triggerFileInput = () => {
  fileInput.value.click();
};

// Upload File
const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (file) {
    await uploadFile(file, null); 
    await loadData(); 
  }
};

// Create Folder
const handleCreateFolder = async (folderName) => {
  await createFolder(folderName, null); 
  await loadData();
};

// Delete an item
const handleDelete = async (selectedItem) => {
  if (selectedItem && selectedItem.id) {
    await deleteItem(selectedItem.id, selectedItem.type);
    await loadData();
  } else {
    console.error("Invalid item selected for deletion:", selectedItem);
  }
};

// Edit an item name
const handleEditName = async (newName) => {
  if (selectedItem.value) {
    await editName(selectedItem.value.id, selectedItem.value.type, newName);
    await loadData();
  }
};

// Move an Item into a Folder
const handleMove = async (targetFolderId) => {
  if (selectedItem.value && targetFolderId) {
    console.log(`Moving ${selectedItem.value.type} with ID ${selectedItem.value.id} to folder ID ${targetFolderId}`);
    await moveItem(selectedItem.value.id, selectedItem.value.type, targetFolderId);
    await loadData();
    showMoveModal.value = false; 
  } else {
    console.error('Invalid item or target folder ID for moving:', selectedItem.value, targetFolderId);
  }
};

</script>

  
<style>
  
*, *::before, *::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

#app {
  min-height: 100vh;
  width: 100%;
}
</style>

<style scoped>
.home-container {
  min-height: 100vh;
  width: 100%;
  background-color: #f8f9fa;
  display: flex;
  flex-direction: column;
}

.nav-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 3.0rem 1.25rem 4.0rem;
  background-color: #a94442;
  color: white;
  width: 100%;
}

.nav-left {
  display: flex;
  align-items: center;
}

.home-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: white;
  font-size: 1rem;
  cursor: pointer;
}

.folder-icon , .file-icon{
  width: 2.25rem;
  height: 2.25rem;
  color: #deb887;
}

.nav-right {
  display: flex;
  gap: 1rem;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 20px;
  background-color: #faf0e6;
  color: #333;
  cursor: pointer;
  font-size: 0.9rem;
}

.button-icon {
  width: 1rem;
  height: 1rem;
}

.main-content {
  flex: 1;
  padding: 2rem 4rem;
  width: 100%;
  max-width: 100%;
  
}

.section {
  margin-bottom: 2rem;
}

.section-title {
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.sort-button {
  padding: 0.5rem 1rem;
  border: 1px solid #a94442;
  border-radius: 4px;
  background: none;
  color: #a94442;
  cursor: pointer;
}

.folders-files-container {
  display: flex;
  justify-content: space-between;
}

.folders-grid, .files-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 2rem;
  width: 100%; 
}

.folder-item, .file-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.0rem;
  padding: 1.5rem;
  background-color: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.folder-item:hover , .file-item:hover{
  background-color: #f0f0f0;
}

.folder-item.selected , .file-item.selected{
  outline: 2px solid #2196f3;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.icon-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid #a94442;
  border-radius: 4px;
  background: none;
  color: #a94442;
  cursor: pointer;
}

.action-icon {
  width: 1rem;
  height: 1rem;
}

.icon-button:hover {
  background-color: #a94442;
  color: white;
}
</style>