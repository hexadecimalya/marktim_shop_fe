<template>
    <section class="py-4 md:py-8 px-4 max-w-5xl mx-auto">
        <h2 class="text-3xl font-semibold py-4">Доставка та оплата</h2>
        <div class="md:flex items-center gap-8">
            <div class="text-justify  text-sm">
                <p class="mb-4">
                    У MarkTim ми прагнемо зробити покупки максимально зручними для вас!
                    Товари з нашого магазину доставляються по всій Україні за допомогою національних перевізників:</p>
                <ul class="list-disc ml-4 my-4">
                    <li>
                        Нова пошта
                    </li>
                    <li>
                        Укрпошта
                    </li>
                    <li>
                        Meest
                    </li>
                </ul>

                <p class="my-4">
                    Також ви можете забрати замовлення самостійно з нашого магазину за адресою <span
                        class="italic font-semibold"> м. Славутич, Тбіліський квартал 1</span>, (навпроти Укрпошти через
                    дорогу).
                </p>

                <p class="my-4">
                    Оплата здійснюється наступним чином:
                </p>
                <ul class="list-disc ml-4 my-4">
                    <li>
                        За банківськими реквізитами
                    </li>
                    <li>
                        У магазині — готівкою або банківською карткою
                    </li>

                </ul>

                <p class="mt-4"> Обирайте зручний для вас спосіб доставки та оплати — і насолоджуйтесь якісними
                    європейськими
                    товарами
                    разом із MarkTim!
                </p>
                <h2 class="text-3xl font-semibold py-4">
                    Графік роботи
                </h2>
                <div class="grid grid-cols-2">
                    <div>понеділок-пʼятниця</div>
                    <div class="font-medium">09:00 - 19:00</div>
                    <div>субота та неділя</div>
                    <div class="font-medium">10:00 - 16:00</div>
                    <div>святкові дні</div>
                    <div class="font-medium">уточнюємо в соцмережах</div>
                </div>
                <h2 class="text-3xl font-semibold py-4">Питання? Ми на звʼязку</h2>
                <div class="md:w-1/2 w-full ">
                    <p class="pb-4 border-b-2 border-dotted">
                        +380 (66) 462 09 98
                    </p>
                    <p class="py-4 border-b-2 border-dotted"> marktim.shop@gmail.com <br>
                        buruksvetlana@gmail.com</p>

                </div>

            </div>
        </div>
    </section>
</template>
<script setup>
const config = useRuntimeConfig()
useSeoMeta({
    title: 'Доставка та оплата',
    ogTitle: 'Доставка та оплата | MarkTim Shop',
    description: 'Обирайте зручний спосіб доставки: по Україні за допомогою Нової пошти, Укрпошти, Delivery чи самовивіз зі магазину в м. Славутич. Оплата – банківським переказом або в магазині.',
    ogDescription: 'У MarkTim Shop ми зробили покупки максимально зручними: оберіть доставку по Україні через провідних перевізників або самовивіз з магазину в м. Славутич, а оплата доступна як банківським переказом, так і безпосередньо в магазині.',
    ogImage: `${config.public.siteUrl}/og-default.png`,
    twitterCard: 'summary_large_image',
    twitterImage: `${config.public.siteUrl}/og-default.png`,
    twitterTitle: 'Доставка та оплата | MarkTim Shop',
    twitterDescription: 'Обирайте зручний спосіб доставки: по Україні за допомогою Нової пошти, Укрпошти, Delivery чи самовивіз зі магазину в м. Славутич. Оплата – банківським переказом або в магазині.'

})
</script>