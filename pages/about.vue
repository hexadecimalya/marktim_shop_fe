<template>
  <section class="container mt-8 mx-auto xl:w-5/6 lg:w-11/12 w-full pt-4 py-12 px-4 text-center">
    <h1 class="text-4xl font-semibold mb-4">Європейський смак з душею</h1>
    <p class="text-lg md:text-xl max-w-3xl mx-auto mb-6">
      MarkTim — магазин, натхненний подорожами, родинними цінностями та любов’ю до смачної їжі.
    </p>
    <img src="@/assets/hero-img.jpeg" alt="Європейські смаколики"
      class="mx-auto rounded-xs shadow-lg w-full max-w-5xl" />
  </section>

  <section class="py-12 px-4 max-w-5xl mx-auto bg-mtgreen-50">
    <h2 class="text-3xl font-semibold mb-4">Трошки історії</h2>
    <div class="md:flex items-center gap-8 text-sm">
      <div class="md:w-1/2 text-justify">
        <p class="mb-6">
          Ідея MarkTim народилася у серці Світлани Бурук — мами двох синів, Марка і Тіма. Їхні імена стали основою назви
          магазину, а родинна турбота — головним принципом нашої роботи.
        </p>
        <blockquote class="border-l-4 border-yellow-500 pl-4 italic text-gray-600 mb-4">
          “Мені хотілося створити магазин, де кожен знайде улюблені європейські смаки, і при цьому відчує себе як
          удома.” — Світлана
        </blockquote>

        <p class="mb-6">
          Усе починалося з простої Viber-спільноти, куди долучились друзі та знайомі. З часом ми усвідомили необхідність
          створення веб-сайту, на якому можна було б ознайомитися з нашим асортиментом, дізнатися про нові поставки, а
          також оформляти замовлення і передзамовлення.
        </p>
        <p class="mb-6">
          Наш асортимент безперервно розширювався, і вже в листопаді 2021 року ми відкрили офлайн-магазин. Це дозволило
          кожному клієнту не тільки обрати потрібний продукт, але й отримати живе спілкування з нашими фахівцями,
          допомогу у виборі конкретного товару або подарунка, а іноді навіть замовити щось дійсно унікальне, що не
          знайти в інших магазинах.
        </p>
        <p>
          Сьогодні ми пишаємося якістю, до якої завжди прагнули. Чесність та прозорість у роботі — це основні принципи
          нашої команди. На нашому сайті ви завжди знайдете актуальну інформацію про товари, їхні ціни, кількість та
          наявність на складі, а також дані щодо розкладу роботи і контакти для зворотного зв’язку.
        </p>
      </div>
      <div class="md:w-1/2 mt-8 md:mt-0">
        <img
          src="https://images.unsplash.com/photo-1557236751-b60abca1479e?q=80&w=3147&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Сімейна історія" class="shadow-md" />
      </div>
    </div>
  </section>

  <section class="py-12 px-4 max-w-5xl mx-auto">
    <!-- <h2 class="text-3xl font-semibold mb-4">Наш підхід</h2> -->
    <div class="grid md:grid-cols-4 grid-cols-2 sm:gap-16 gap-8 text-center">
      <div>
        <UIcon name="i-solar-shop-linear" class="size-8" />
        <div class="font-semibold">Магазин</div>
        <div class="text-sm">завітайте до нас персонально або робіть замовлення на зручному сайті</div>
      </div>
      <div>
        <UIcon name="i-solar-delivery-linear" class="size-8" />
        <div class="font-semibold">Доставка</div>
        <div class="text-sm">ваші замовлення блискавично передаються транспортній службі</div>
      </div>
      <div>
        <UIcon name="i-solar-sale-linear" class="size-8" />
        <div class="font-semibold">Знижки</div>
        <div class="text-sm">персоналізовані картки лояльності для приємного шопінгу</div>
      </div>
      <div>
        <UIcon name="i-solar-gift-linear" class="size-8" />
        <div class="font-semibold">Допомога</div>
        <div class="text-sm">підберемо ідеальний подарунок для самого вибагливого гурмана</div>
      </div>
    </div>
  </section>
  <section class="bg-mtgreen-50 py-12 px-4 max-w-5xl mx-auto">
    <h2 class="text-3xl font-semibold mb-4">Що ми пропонуємо</h2>
    <div class="md:flex items-center gap-8">
      <div class="md:w-1/2 text-justify">
        <!-- <div class="grid md:grid-cols-2 gap-8 font-medium text-2xl"> -->
        <div>
          <h3 class="text-xl underline mb-4">Продукти з усього світу</h3>
          <p class="mb-4 text-sm">В нас легко знайти товари з Польщі, Італії, Німеччини, Іспанії та інших країн, бо ми
            ретельно приділяємо
            увагу оригінальним продуктам, в тому числі тим, які виготовляються лиш в специфічних регіонах. Саме так,
            адже справжня грецька фета, бальзамічні соуси з сировини з Модени, овечий сир з Канарських островів,
            вишукані португальскі джеми з вином –– зовсім не рідкість у нас на полицях. </p>
        </div>
        <div>
          <h3 class="text-xl underline mb-4">Власні закупівлі</h3>
          <p class="mb-4 text-sm">
            На наших поличках товар з’являється наступним чином: від перевірених постачальників або ж одразу з магазинів
            Європи. Продукти закупаємо власноруч, ретельно перевіряючи терміни придатності та інші нюанси. У більшості
            випадків наші клієнти можуть долучатися онлайн закупів і обирати будь-який товар разом з нами, для того, щоб
            вже через декілька днів отримати своє замовлення вдома. </p>
        </div>
        <div>
          <h3 class="text-xl underline mb-4">Бути завжди в тренді</h3>
          <p class="mb-4 text-sm">Ми невпинно відслідковуємо тенденції, щоб привезти найочікуваніші новинки і дати
            можливіть скуштувати їх першими! </p>
        </div>
        <div>
          <h3 class="text-xl underline mb-4">Готові подарункові набори + сертифікати</h3>
          <p class="mb-4 text-sm">Попереду свято, але не знаєте, чим здивувати близьких? Довірте нам вибір смачного
            подарунку! Наша команда врахує всі деталі та побажання щодо персональних уподобань кожного і виконає підбір
            продуктів, які 100% влучать в ціль.</p>
          <p class="mb-4 text-sm">Друга опція –– подарункові сертифікати на будь-яку суму у вигляді мінімалістичної
            листівки, яка універсально пасуватиме будь-кому незалежно від статі, віку та приводу. </p>
        </div>
      </div>

      <div class="md:w-1/2">
        <img
          src="https://images.unsplash.com/photo-1706378398576-57a21244ef7a?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Подарункові пакування" class="shadow-lg" />
      </div>
    </div>
  </section>
  <section  class="py-12 px-4 text-center max-w-4xl mx-auto">
    <h2 id="location" class="text-3xl font-semibold mb-4">Гастрономічні подорожі починаються тут!</h2>
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