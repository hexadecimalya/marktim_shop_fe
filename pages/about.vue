<template>
      <section class="container mt-8 mx-auto xl:w-5/6 lg:w-11/12 w-full pt-4 bg-mtgreen-50 py-12 px-4 text-center">
      <h1 class="text-4xl font-semibold mb-4">Європейський смак з душею</h1>
      <p class="text-lg md:text-xl max-w-3xl mx-auto mb-6">
        MarkTim — магазин, натхненний подорожами, родинними цінностями та любов’ю до смачної їжі.
      </p>
      <img src="@/assets/hero-img.jpeg" alt="Європейські смаколики" class="mx-auto rounded-xs shadow-lg w-full max-w-5xl" />
    </section>

    <section class="py-12 px-4 max-w-5xl mx-auto">
      <h2 class="text-3xl font-semibold mb-4">Трошки історії</h2>
      <div class="md:flex items-center gap-8">
        <div class="md:w-1/2">
          <p class="mb-6">
            Ідея MarkTim народилася у серці Світлани Бурук — мами двох синів, Марка і Тіма. Їхні імена стали основою назви магазину, а родинна турбота — головним принципом нашої роботи.
          </p>
          <blockquote class="border-l-4 border-yellow-500 pl-4 italic text-gray-600">
            “Мені хотілося створити магазин, де кожен знайде улюблені європейські смаки, і при цьому відчує себе як удома.” — Світлана Бурук
          </blockquote>
        </div>
        <div class="md:w-1/2 mt-8 md:mt-0">
          <img src="https://images.unsplash.com/photo-1557236751-b60abca1479e?q=80&w=3147&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Сімейна історія" class="shadow-md" />
        </div>
      </div>
    </section>

    <section class= "bg-mtgreen-50 py-12 px-4 max-w-5xl mx-auto">
      <h2 class="text-3xl font-semibold mb-4">Що ми пропонуємо</h2>
      <!-- <div class="grid md:grid-cols-2 gap-8"> -->
        <ul class="list-disc pl-6 space-y-3 text-lg">
          <li>Продукти з Польщі, Італії, Німеччини, Іспанії та інших країн</li>
          <li>Власні закупівлі — обираємо найкраще вручну</li>
          <li>Солодощі, делікатеси, соуси, снеки, напої</li>
          <li>Gourmet-асортимент для справжніх гурманів</li>
          <li>Готові подарункові набори + сертифікати</li>
        </ul>
           <!-- <img src="https://images.unsplash.com/photo-1622341357129-c460d41da93d?q=80&w=2500&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Подарункові пакування" class="shadow-lg" /> -->
      <!-- </div> -->
    </section>

    <section class="py-12 px-4 max-w-5xl mx-auto">
      <h2 class="text-3xl font-semibold mb-4">Наш підхід</h2>
      <div class="grid md:grid-cols-2 gap-6 text-lg">
        <ul class="space-y-3">
          <li>Фізичний магазин + зручний онлайн</li>
          <li>Доставка по всій Україні</li>
          <li>Персоналізовані картки лояльності зі знижкою</li>
          <li>Поради й допомога в підборі смаколиків та подарунків</li>
          <li>Упаковка з любов’ю — кожне замовлення як для себе</li>
        </ul>
        <img src="https://images.unsplash.com/photo-1699788201352-c700fd34a38c?q=80&w=3120&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Подарункові пакування" class="shadow-lg" />
      </div>
  
    </section>

    <!-- <section class= "bg-mtgreen-50 py-12 px-4 max-w-5xl mx-auto">
      <h2 class="text-3xl font-semibold mb-6">Наші цінності</h2>
      <div class="grid md:grid-cols-2 gap-8">
        <ul class="space-y-3 text-lg">
          <li><strong>Якість:</strong> тільки перевірені бренди й постачальники</li>
          <li><strong>Чесність:</strong> прозорі ціни, достовірна інформація</li>
          <li><strong>Затишок:</strong> європейський магазинчик у вашому місті</li>
          <li><strong>Турбота:</strong> ми дбаємо про кожного клієнта</li>
        </ul>
        <img src="https://source.unsplash.com/featured/?quality,trust" alt="Наші цінності" class="rounded-xl shadow" />
      </div>
    </section> -->

    <section class="py-12 px-4 text-center max-w-4xl mx-auto">
      <h2 class="text-3xl font-semibold mb-4">Гастрономічні подорожі починаються тут!</h2>
      <p class="mb-4 text-lg">Завітайте до нашого магазину або замовляйте онлайн — ми завжди раді вам!</p>
      <p class="mb-1">📍 Адреса: м. Славутич, Тбіліський квартал, буд. 1 (Навпроти УкрПошти)</p>

      <p>📞 Телефон : <span class="underline">+380 (66) 462 09 98</span> (Світлана)</p>
    </section>
   <!-- </section> -->
</template>
<script setup>
useSeoMeta({
  title: 'Про нас',
  ogTitle: 'Про нас | MarkTim Shop – Європейський смак з душею',
  description: 'MarkTim – магазин, натхненний подорожами та родинними цінностями. Ми ретельно відбираємо європейські продукти, gourmet-делікатеси та подарункові набори, даруючи унікальний смак кожному клієнту.',
  ogDescription: 'Зануртесь у світ MarkTim – місця, де подорожі, родинні цінності та любов до смачної їжі створюють неповторний гастрономічний досвід. Відкрийте для себе преміальний асортимент європейських делікатесів.',
  ogImage: 'https://example.com/image.png',
  twitterCard: 'summary_large_image',
})
</script>