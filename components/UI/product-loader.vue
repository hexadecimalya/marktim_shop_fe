<template>
    <div class="lg:container sm:mt-8 mx-auto p-8">
        <div class="flex flex-col gap-4">
            <div class="flex gap-4 ">
                <div class="flex flex-col gap-4 w-1/2">
                    <USkeleton class="h-84 flex">
                        <!-- <div class="justify-center">
                            <img class="opacity-15" src="@/assets/mt_logo_round.png" alt="">
                        </div> -->
                    </USkeleton>
                </div>
                <div class="flex flex-col gap-4 w-1/2 ">
                    <USkeleton class="h-10" />
                    <USkeleton class="h-10" />
                    <USkeleton class="h-10 w-1/5" />
                    <USkeleton class="h-10" />
                    <USkeleton class="h-10" />
                </div>
            </div>
            <div class="flex flex-col gap-2">
                <USkeleton class="h-10" />
                <USkeleton class="h-21" />
            </div>
        </div>
    </div>
</template>
