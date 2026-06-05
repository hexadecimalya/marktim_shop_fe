<template>
  <div class="max-w-md mx-auto my-8 font-sans">
    <div class="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
      
      <div class="p-6 pb-4 bg-gray-50/50 border-b border-gray-100">
        <h2 class="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-4">
          Налаштування курсу
        </h2>
        
        <div class="flex items-center gap-3">
          <div class="flex-1">
            <UInput 
              v-model="state.exchangeRate" 
              type="number" 
              step="0.01" 
              variant="none"
              placeholder="Курс (напр. 13.30)" 
              class="bg-white border border-gray-200 rounded-xl px-1"
            />
          </div>

          <UPopover :popper="{ placement: 'bottom-end' }">
            <button type="button" class="flex items-center gap-2 px-3 py-2 text-sm bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all">
              <span class="text-gray-600">{{ formattedDate || 'Дата' }}</span>
              <UIcon name="i-lucide-calendar" class="w-4 h-4 text-gray-400" />
            </button>
            <template #content>
              <div class="p-2">
                <UCalendar v-model="state.date" />
              </div>
            </template>
          </UPopover>
        </div>
      </div>

      <div class="p-6 space-y-6">
        <div>
          <label class="block text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-2 ml-1">
            Ціна в ZŁ
          </label>
          <UInput 
            v-model="price" 
            type="number" 
            step="0.01" 
            size="xl"
            placeholder="0.00" 
            color="white"
            variant="none"
            class="text-2xl font-semibold bg-gray-50 border border-gray-100 rounded-2xl transition-all focus-within:ring-2 focus-within:ring-gray-200"
            @focus="$event.target.select()"
          />
        </div>
 <div>
          <label class="block text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-2 ml-1">
            Опис
          </label>
          <UTextarea 
            v-model="description" 
            size="xl"
            color="white"
            variant="none"
            class="text-2xl w-full font-semibold bg-gray-50 border border-gray-100 rounded-2xl transition-all focus-within:ring-2 focus-within:ring-gray-200"/>
        </div>

        <Transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0 transform scale-95"
          enter-to-class="opacity-100 transform scale-100"
        >
          <div v-if="message" class="relative group">
            <div class="absolute -top-3 right-3 z-10">
              <UButton
                :color="copied ? 'success' : 'neutral'"
                :icon="copied ? 'i-lucide-check' : 'i-lucide-copy'"
                size="xs"
                class="rounded-full shadow-lg transition-all"
                @click="copyMessage"
              >
                {{ copied ? 'Скопійовано' : 'Копіювати' }}
              </UButton>
            </div>

            <div 
              class="p-5 pt-7 bg-gray-900 rounded-2xl text-gray-100 cursor-pointer hover:bg-black transition-colors"
              @click="copyMessage"
            >
              <pre class="text-sm font-mono whitespace-pre-wrap leading-relaxed">{{ message }}</pre>
            </div>
            
            <p class="text-center text-[10px] text-gray-400 mt-3 uppercase tracking-widest">
              Натисніть на текст, щоб скопіювати
            </p>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watchEffect } from 'vue'
import { today, getLocalTimeZone } from '@internationalized/date'

definePageMeta({ layout: 'admin' })

const state = reactive({
  exchangeRate: null, 
  date: today(getLocalTimeZone()),
})

const price = ref(null)
const description = ref('')
const message = ref('')
const copied = ref(false)

const UA_MONTHS = [
  'січня', 'лютого', 'березня', 'квітня', 'травня', 'червня',
  'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня',
]

const formattedDate = computed(() =>
  state.date ? `${state.date.day} ${UA_MONTHS[state.date.month - 1]}` : ''
)


const calculateFloatingRate = (zl) => {
  if (zl < 2.49) return 1.4
  if (zl < 6.99) return 1.3
  if (zl < 8.49) return 1.28
  return 1.27
}


watchEffect(() => {
  const zl = parseFloat(price.value)
  const rate = parseFloat(state.exchangeRate)

  if (!zl || !rate || isNaN(zl) || isNaN(rate)) {
    message.value = ''
    return
  }

  // Formula: zl * rate * 1.25 * 1.1 * floatingRate
  const sell_price = Math.ceil(zl * rate * 1.25 * 1.1 * calculateFloatingRate(zl))
  const bulk_price = Math.ceil(sell_price * 0.95)

  message.value = `*⚡️Флеш-замовлення⚡️*

${description.value}

💳 Ціна: ${sell_price} грн
ОПТ від 2 шт: ${bulk_price} грн

🎩 \`\`\`діє ${formattedDate.value}\`\`\` 🪄`
})

// --- Actions ---
const copyMessage = async () => {
  if (!message.value) return
  try {
    await navigator.clipboard.writeText(message.value)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch (err) {
    console.error('Copy failed', err)
  }
}
useHead({title: 'Калькулятор для збору Viber'})
</script>

