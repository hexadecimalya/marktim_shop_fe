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
              <NuxtLink to="/preorder-info" class="hover:font-semibold">Як зробити передзамовлення</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/delivery" class="hover:font-semibold">Оплата та доставка</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/about#location" class="hover:font-semibold">Де ми знаходимося</NuxtLink>
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
                  <NuxtLink href="https://www.instagram.com/marktim.shop/" target="_blank" rel="noopener noreferrer">
<!-- <UIcon name="i-lucide-instagram" class="w-6 h-6 p-4 mx-4" /> -->
                    <UIcon name="i-mingcute:instagram-fill" class="w-6 h-6 p-4 mx-4" />
                  </NuxtLink>
                </UTooltip>
                
              </div>
              <div>

                <UTooltip text="Viber">
                  <a href="https://invite.viber.com/?g2=AQBV7vVtBsCtzkjDXxda3N%2BpAMy9rCjwCr48sgTsS%2FfQeiCq3o7hE7CjNts5jsoh"
                    target="_blank" rel="noopener noreferrer">
                    <Icon name="i-mingcute:viber-messenger-fill" class="w-6 h-6 p-4 mx-4" />
                  </a>
                </UTooltip>
              </div>
            </div>
            <li>
              <div>Контакти</div>
            </li>

            <li class="flex">
              <UIcon name="i-heroicons:phone-16-solid" class="w-6 h-6 p-2 mx-4" />
              <span class="hover:text-gray-900">
                +380 (66) 462 09 98
              </span>
            </li>

            <li class="flex">
              <UIcon name="i-heroicons:envelope-16-solid" class="w-6 h-6 p-2 mx-4" />
              <span class=" hover:text-gray-900">
                marktim.shop@gmail.com</span>

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
