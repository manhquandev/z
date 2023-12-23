<template>

  <Toolbar style="margin-bottom: 10px">
    <template #start>
      <Button icon="pi pi-upload" @click="openFile" class="mr-2" />
      <input type="file" ref="_file" accept=".application/vnd.sealed.xls,.csv,.xlsx" style="display:none" @input="onInput">
      <h4>Đang đọc file :  {{file?.name}}</h4>
    </template>
    <template #end>
      <Button @click="start" icon="pi pi-print"/>
    </template>
  </Toolbar>

  <DataTable scrollHeight="calc(100vh - 130px)" scrollable showGridlines size="small" :value="data[0]"
             tableStyle="max-width:100vw" v-if="data">
    <Column style="max-width:200px; word-wrap: break-word;" v-for="(item,index) in keys" :header="item" :field="item" :key="index"></Column>
  </DataTable>


</template>
<script setup lang="ts">
import {ref} from "vue";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

import Toolbar from 'primevue/toolbar';

const _file = ref<HTMLInputElement>()
const file = ref()
const data = ref()
const keys = ref<string[]>([]);

window.ipcRenderer.on('download-success',(_event, _args)=>{
  console.log(_args)
})

window.ipcRenderer.on('read-done', (_event, _args) => {
  data.value = _args
  keys.value = []
  data.value[0].forEach((item:{[key:string]:string})=>{
    item.status = 'read'
  })
  for (const key in data.value[0][0]) {
    keys.value.push(key);
  }
})
const onInput = (e: any) => {
  file.value = e.target.files[0]
  window.ipcRenderer.send('read', file.value.path)
}
const openFile = ()=>{
  _file.value?.click()
}

const start = ()=>{
  window.ipcRenderer.send('start')
}
</script>
<style scoped>
.table-view {
  width: 100%;
  min-height: 50vh;
  max-height: 85vh;
  overflow: auto;

}

.table-view * {
  font-size: 0.9rem !important;
}

.mr-2 {
  margin-right: 0.5rem !important;
}
</style>