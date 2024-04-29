// 文件：useScreenOrientation.js
import { ref, onMounted, onUnmounted } from 'vue';

export function useScreenOrientation() {
  const isLandscape = ref(window.innerWidth > window.innerHeight);

  function checkOrientation() {
    isLandscape.value = window.innerWidth > window.innerHeight;
  }

  onMounted(() => {
    window.addEventListener('resize', checkOrientation);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', checkOrientation);
  });

  return { isLandscape };
}
