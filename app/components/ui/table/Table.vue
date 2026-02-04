<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { cn } from "@/lib/utils"

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()
</script>

<template>
  <!-- Allow table container to expand to full height when parent provides `h-full` so
       internal scrolling works as expected (useful for pages that constrain table height).
       This keeps backward compatibility because it only adds `h-full`. -->
  <div data-slot="table-container" class="relative w-full overflow-auto h-full">
    <table data-slot="table" :class="cn('w-full caption-bottom text-sm', props.class)">
      <slot />
    </table>
  </div>
</template>
