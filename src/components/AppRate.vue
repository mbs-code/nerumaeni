<template>
  <van-rate
    v-model="value"
    :color="color"
    void-icon="star-o"
    void-color="#eee"
  />
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue?: number
}>()

// eslint-disable-next-line func-call-spacing
const emit = defineEmits<{
  (e: 'update:modelValue', value?: number): void,
}>()

const value = computed({
  get: () => props.modelValue,
  set: (value?: number) => emit('update:modelValue', value),
})

const color = computed(() => {
  switch (value.value) {
    case 1: return '#1ab1db'
    case 2: return '#21bfa5'
    case 3: return '#5dba38'
    case 4: return '#ffd21e'
    case 5: return '#e68217'
    default: return '#444a4a'
  }
})
</script>
