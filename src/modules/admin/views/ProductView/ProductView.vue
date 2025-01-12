<template>
  <div class="bg-white px-5 py-2 rounded dark:bg-gray-700 text-black dark:text-white">
    <h1 class="text-3xl">
      Producto: <small class="text-blue-500">{{ title }}</small>
    </h1>
    <hr class="my-4" />
  </div>

  <form
    @submit="onSubmit"
    class="grid grid-cols-1 sm:grid-cols-2 bg-white px-5 gap-5 dark:bg-gray-700 text-black dark:text-white"
  >
    <div class="first-col">
      <!-- Primera parte del formulario -->
      <div class="mb-4">
        <label for="title" class="form-label">Título</label>
        <InputText v-model="title" v-bind="titleAttrs" :error="errors.title" />
      </div>

      <div class="mb-4">
        <label for="slug" class="form-label">Slug</label>
        <InputText v-model="slug" v-bind="slugAttrs" :error="errors.slug" />
      </div>

      <div class="mb-4">
        <label for="description" class="form-label">Descripción</label>

        <TextArea v-model="description" v-bind="descriptionAttrs" :error="errors.description" />
      </div>

      <div class="flex flex-row gap-3">
        <div class="mb-4">
          <label for="price" class="form-label">Precio</label>
          <InputText v-model.number="price" v-bind="priceAttrs" :error="errors.price" />
        </div>

        <div class="mb-4">
          <label for="stock" class="form-label">Inventario</label>
          <InputText v-model.number="stock" v-bind="stockAttrs" :error="errors.stock" />
        </div>
      </div>

      <div class="mb-4">
        <label for="sizes" class="form-label">Tallas</label>
        <div class="flex flex-row gap-2">
          <button
            v-for="size in sizesButtons"
            :key="size"
            type="button"
            :class="[
              'p-2 rounded w-14 mr-2 flex-1',
              {
                'bg-blue-100': !hasSize(size),
                'bg-blue-500 text-white': hasSize(size),
              },
            ]"
            @click="toggleSize(size)"
          >
            {{ size }}
          </button>
        </div>
        <span v-if="errors.sizes" class="text-red-500 text-xs">{{ errors.sizes }}</span>
      </div>
    </div>

    <!-- Segunda columna -->
    <div class="first-col dark:bg-gray-700 text-black dark:text-white">
      <label for="stock" class="form-label">Imágenes</label>
      <!-- Row with scrollable horizontal -->
      <div class="flex p-2 overflow-x-auto space-x-8 w-full h-[265px] bg-gray-200 rounded">
        <div class="flex-shrink-0" v-for="image in productImagesList" :key="image.key">
          <img :src="image.value" alt="imagen" class="w-[250px] h-[250px]" />
        </div>
        <div class="flex-shrink-0" v-for="image in imageFileList" :key="image.name">
          <img :src="createUrlImage(image)" alt="imagen" class="w-[250px] h-[250px]" />
        </div>
      </div>
      <!-- Upload image -->
      <div class="col-span-2 my-2">
        <label for="image" class="form-label">Subir imagen</label>

        <input
          multiple
          type="file"
          id="image"
          class="form-control"
          accept="image/*"
          @change="onImageFileChange"
        />
      </div>

      <div class="mb-4">
        <label for="stock" class="form-label">Género</label>
        <select class="form-control" v-model="gender" v-bind="genderAttrs">
          <option value="">Seleccione</option>
          <option value="kid">Niño</option>
          <option value="women">Mujer</option>
          <option value="men">Hombre</option>
        </select>
        <span v-if="errors.gender" class="text-red-500 text-xs">{{ errors.gender }}</span>
      </div>

      <!-- Botón para guardar -->
      <div class="my-4 text-right">
        <button
          :disabled="isLoading"
          type="submit"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Guardar
        </button>
      </div>
    </div>
  </form>
  <div
    class="grid grid-cols-1 sm:grid-cols-2 bg-white px-5 gap-5 dark:bg-gray-700 text-black dark:text-white"
  >
    <div class="bg-green-200">
      {{ values }}
    </div>
    <div class="bg-red-200">
      {{ errors }}
    </div>
  </div>
</template>

<script lang="ts" src="./ProductView.ts"></script>

<style scoped>
.form-label {
  @apply block text-gray-700 text-sm font-bold mb-2;
}

.form-control {
  @apply shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none dark:bg-gray-700 dark:text-white;
}
</style>
