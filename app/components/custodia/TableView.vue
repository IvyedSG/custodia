<script setup lang="ts">
import { Button } from '@/components/ui/button';
import type { CustodiaItem } from './types';

interface Props {
  data: CustodiaItem[];
}

defineProps<Props>();

const emit = defineEmits<{
  openDetail: [item: CustodiaItem];
}>(); 
</script>

<template>
  <div class="flex-1 overflow-hidden flex flex-col">
  <div class="flex-1 overflow-hidden bg-white rounded-b-xl shadow-sm flex flex-col">
  <div class="flex-1 overflow-hidden pt-3 lg:pt-6 px-3 lg:px-6 pb-6">
        <div class="h-full border flex flex-col">
          <div class="w-full">
            <table class="w-full table-fixed border-collapse">
              <colgroup>
                <col style="width:16.6667%">
                <col style="width:16.6667%">
                <col style="width:16.6667%">
                <col style="width:16.6667%">
                <col style="width:16.6667%">
                <col style="width:16.6667%">
              </colgroup>
              <thead class="bg-gray-50/80 border-b border-gray-200">
                <tr>
                  <th class="text-left font-semibold text-gray-700 text-sm lg:text-base px-2 lg:px-4 py-2 lg:py-3">Nombres</th>
                  <th class="text-left font-semibold text-gray-700 text-sm lg:text-base px-2 lg:px-4 py-2 lg:py-3">Numeración</th>
                  <th class="text-left font-semibold text-gray-700 text-sm lg:text-base px-2 lg:px-4 py-2 lg:py-3">Ubicación</th>
                  <th class="text-left font-semibold text-gray-700 text-sm lg:text-base px-2 lg:px-4 py-2 lg:py-3">Equipo</th>
                  <th class="text-left font-semibold text-gray-700 text-sm lg:text-base px-2 lg:px-4 py-2 lg:py-3">Teléfono</th>
                  <th class="text-center font-semibold text-gray-700 text-sm lg:text-base px-2 lg:px-4 py-2 lg:py-3">Acciones</th>
                </tr>
              </thead>
            </table>
          </div>

          <div class="flex-1 overflow-auto">
            <table class="w-full table-fixed border-collapse">
              <colgroup>
                <col style="width:16.6667%">
                <col style="width:16.6667%">
                <col style="width:16.6667%">
                <col style="width:16.6667%">
                <col style="width:16.6667%">
                <col style="width:16.6667%">
              </colgroup>
              <tbody>
                <tr v-for="(item, index) in data" :key="index" class="hover:bg-gray-50/50 transition-colors border-t">
                  <td class="px-2 lg:px-4 py-2 lg:py-4 align-middle font-medium text-gray-900 text-sm lg:text-base">{{ item.nombres }}</td>
                  <td class="px-2 lg:px-4 py-2 lg:py-4 align-middle">
                    <span class="inline-flex items-center px-3 py-1.5 rounded-md bg-blue-50 text-blue-700 font-mono text-base font-medium border border-blue-200">
                      #{{ item.numeracion }}
                    </span>
                  </td>
                  <td class="px-2 lg:px-4 py-2 lg:py-4 align-middle">
                    <span class="inline-flex items-center px-2 md:px-3 py-1 rounded-md bg-purple-50 text-purple-700 font-semibold text-sm lg:text-base border border-purple-200">
                      {{ item.ubicacion }}
                    </span>
                  </td>
                  <td class="px-2 lg:px-4 py-2 lg:py-4 align-middle">
                    <span class="inline-flex items-center px-2 md:px-3 py-1 rounded-md bg-gray-50 text-gray-700 text-sm lg:text-base font-medium border border-gray-200">
                      {{ item.equipo }}
                    </span>
                  </td>
                  <td class="px-2 lg:px-4 py-2 lg:py-4 align-middle text-gray-600 text-sm lg:text-base">{{ item.telefono }}</td>
                  <td class="px-2 lg:px-4 py-2 lg:py-4 align-middle text-center">
                    <Button
                      v-if="!item.entregado"
                      variant="outline"
                      size="default"
                      class="text-sm lg:text-base"
                      @click="emit('openDetail', item)"
                    >
                      Ver Detalle
                    </Button>
                    <span v-else class="text-sm text-gray-400">—</span>
                  </td>
                </tr>
              </tbody>
            </table>

            <div v-if="data.length === 0" class="text-center py-12">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="mx-auto mb-4 text-gray-300">
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M3 9h18" />
                <path d="M9 21V9" />
              </svg>
              <h3 class="text-lg font-semibold text-gray-900 mb-1">No hay objetos en custodia</h3>
              <p class="text-sm text-gray-500">No se encontraron registros para mostrar.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
