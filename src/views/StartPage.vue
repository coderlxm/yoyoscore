<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useSettingStore } from '@/stores/setting';
import { Icon } from '@iconify/vue';
import { storeToRefs } from "pinia";
import { showToast } from 'vant';
import QRCode from 'qrcode';
const router = useRouter()
const store = useSettingStore()
const startUse = () => {
  sessionStorage.setItem('isRegUser', true)
  router.push({ name: 'home' })
}
const { deferredPrompt } = storeToRefs(store)

const handleBeforeInstallPrompt = (e) => {
  e.preventDefault();
  deferredPrompt.value = e;
};
const qrCodeUrl = ref('');
const showShare = ref(false)
const showQRCode = ref(false)
const options = [
  { name: '复制链接', icon: 'link' },
  { name: '二维码', icon: 'qrcode' }
];
const share = () => {
  showShare.value = true
}
const generateQRCode = async () => {
  try {
    qrCodeUrl.value = await QRCode.toDataURL(window.location.href, {
      width: 150,  // 设置二维码宽度
      height: 150, // 设置二维码高度
      margin: 2    // 设置边距（可选）
    });
    showQRCode.value = true;
  } catch (error) {
    console.error('Failed to generate QR code', error);
  }
};
const onSelect = async (option) => {
  // showToast(option.name);
  switch (option.name) {
    case '二维码':
      await generateQRCode();
      break;
    case '复制链接':
      copyLink();
      break;
  }
  showShare.value = false;
};
const copyLink = () => {
  navigator.clipboard.writeText(window.location.href);
  showToast('链接已复制');
};
const saveToAlbum = () => {
  const aTag = document.createElement('a')
  aTag.href = qrCodeUrl.value
  aTag.download = 'YoYoScore.png'
  document.body.appendChild(aTag)
  aTag.click()
  document.body.removeChild(aTag)
}
onMounted(() => {
  window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
});

onBeforeUnmount(() => {
  window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
});
</script>
<template>
  <Transition appear name="bounce">
    <div class="full flex flex-col items-center justify-center">
      <div :style="{ 'color': store.primaryColor }" class="flex-1 gap-1 flex flex-col items-center justify-center">
        <Icon class="font-size-30" icon="noto:yo-yo" />
        <h1>YoYoScore</h1>
        <!-- <div class="flex flex-col">
        <h4>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;I don't want to win by making compromises to myself, I've
          always wanted to win on my
          own terms</h4>
        <h4 class="self-end">---Kerian Cooper</h4>
      </div> -->
        <van-button style="margin-bottom: 1rem;" :plain="store.systemOSType !== 'ios'" :color="store.primaryColor"
          size="large" @click="startUse">开始使用</van-button>
        <van-button v-if="store.deviceType === 'mobile' && store.systemOSType !== 'ios' && deferredPrompt"
          :color="store.primaryColor" size="large" @click="store.promptInstall()">安装YoYoScore</van-button>
        <van-button :color="store.primaryColor" size="large" @click="share">分享YoYoScore</van-button>
        <!-- <h2>欢迎使用YoYoScore！</h2> -->
      </div>
    </div>
  </Transition>
  <van-share-sheet v-model:show="showShare" title="立即分享给好友" :options="options" @select="onSelect" />
  <van-popup round v-model:show="showQRCode" position="bottom" :style="{ height: '18rem' }">
    <div class="p-6 w-full gap-5 flex flex-col justify-center items-center">
      <img class="mt-5" :src="qrCodeUrl" alt="QR Code" />
      <van-button size="small" @click="saveToAlbum" :color="store.primaryColor">保存二维码</van-button>
    </div>
  </van-popup>
</template>
<style>
.full {
  min-height: 91vh;
}

.bounce-enter-active {
  animation: bounce-in 0.6s;
}

.bounce-leave-active {
  animation: bounce-in 0.6s reverse;
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
  }

  50% {
    transform: scale(1.25);
  }

  100% {
    transform: scale(1);
  }
}
</style>