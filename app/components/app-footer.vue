<template>
  <footer class="app-footer bg-mtgreen-100 border-t border-gray-200">
    <div class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
        <!-- Company Info -->
        <div class="col-span-1">
          <h3 class="text-lg font-semibold mb-4">Компанія</h3>
          <div class="flex items-center mb-4">
            <img src="/assets/MT_Logo.png" class="md:w-32 w-48" />
          </div>
          <p class="text-gray-600 text-sm">
            Гастрономічні подорожі починаються тут!
          </p>
        </div>

        <!-- Links 1 -->
        <div class="col-span-1">
          <h3 class="text-lg font-semibold mb-4">Наші послуги</h3>
          <ul class="md:space-y-2 space-y-1 text-gray-600 text-sm ">
            <li>
              <NuxtLink to="/about" class="hover:font-semibold">Про MarkTim</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/" class="hover:font-semibold">Передзамовлення</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/delivery" class="hover:font-semibold">Оплата та доставка</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/about#location" class="hover:font-semibold">Як нас знайти</NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Contact -->
        <div class="col-span-1">
          <h3 class="text-lg font-semibold mb-4">Звʼяжіться з нами</h3>
          <ul class="md:space-y-2 space-y-1 text-gray-600 text-sm">
            <li>
              <div>Ми в соцмережах:</div>
            </li>
            <div class="flex space-x-4 mb-4">
              <div>
                <UTooltip text="Instagram">
                  <UIcon name="i-f7:logo-instagram" class="w-6 h-6 p-4 mx-4" />
                </UTooltip>
              </div>
              <div>

                <UTooltip text="Facebook">
                  <UIcon name="i-ic:sharp-facebook" class="w-6 h-6 p-4 mx-4" />
                </UTooltip>
              </div>
            </div>
            <li>
              <div>Контакти</div>
            </li>

            <li class="flex ">
              <UIcon name="i-heroicons:phone-16-solid" class="w-6 h-6 p-2 mx-4" />
              <UTooltip text="Скопійовано!" :popper="{ placement: 'top' }" :open="tooltipVisible"><span
                  class="cursor-pointer hover:text-gray-900" @click="copyToClipboard">
                  +380 (66) 462 09 98
                </span>
              </UTooltip>
            </li>

            <li class="flex ">
              <UIcon name="i-heroicons:envelope-16-solid" class="w-6 h-6 p-2 mx-4" />
              <span>buruk.svetlana@gmail.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-xs">
        <p class="text-gray-600 ">
          © {{ new Date().getFullYear() }} MarkTim. All rights reserved.
        </p>
        <div class="mt-4 md:mt-0">
          Powered by Qooqaa Works
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>

const tooltipVisible = ref(false)

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text)
    .then(() => {
      tooltipVisible.value = true
      setTimeout(() => {
        tooltipVisible.value = false
      }, 2000)
    })
    .catch(err => {
      console.error('Failed to copy text: ', err)
    })
}

</script>

<style>
html, 
body {
  height: 100%;
  margin: 0;
}

#__nuxt {
  min-height: 100%;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
}

.app-footer {
  margin-top: auto;
}
</style>
