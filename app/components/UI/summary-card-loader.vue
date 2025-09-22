<template>
     <div class="sm:p-4 p-0 space-y-10">
        <div class="space-y-4">
          <USkeleton class="h-6 w-40" />
          <div v-for="n in 3" :key="n" class="space-y-3">
            <div class="grid grid-cols-5 md:grid-cols-6 items-start sm:gap-4 gap-2">
              <USkeleton class="h-18 w-full col-span-1 rounded-xs" />
              <div class="col-span-3 md:col-span-4 space-y-2">
                <USkeleton class="h-4 w-3/4" />
                <USkeleton class="h-4 w-1/2" />
              </div>
            </div>
            <USeparator />
          </div>
        </div>
      </div>
</template>
